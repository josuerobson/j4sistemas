import pg from "pg";
import fs from "fs";
import path from "path";
import { Inquiry } from "./src/types";

// PostgreSQL Connection credentials provided by user
const DB_CONFIG = {
  host: process.env.PGHOST || "127.0.0.1",
  port: Number(process.env.PGPORT) || 5432,
  database: process.env.PGDATABASE || "spacevip_site",
  user: process.env.PGUSER || "spacevip_react",
  password: process.env.PGPASSWORD || "Jo159357*",
};

let pool: pg.Pool | null = null;
let isPostgresConnected = false;
const fallbackDatabasePath = path.join(process.cwd(), "contacts_db.json");

// Helper to load fallback local database
function readLocalDb(): Inquiry[] {
  try {
    if (fs.existsSync(fallbackDatabasePath)) {
      const content = fs.readFileSync(fallbackDatabasePath, "utf-8");
      return JSON.parse(content || "[]");
    }
  } catch (error) {
    console.error("Erro ao ler banco de dados local fallback:", error);
  }
  return [];
}

// Helper to write to local backup database
function writeLocalDb(data: Inquiry[]) {
  try {
    fs.writeFileSync(fallbackDatabasePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Erro ao salvar arquivo de banco local fallback:", error);
  }
}

// Initialize database
export async function initDb(): Promise<{ isPostgres: boolean }> {
  // If we already established pool, check connection
  if (pool) return { isPostgres: isPostgresConnected };

  console.log("[DB] Inicializando conexão de dados...");
  console.log(`[DB] Tentando conectar ao PostgreSQL em ${DB_CONFIG.host}:${DB_CONFIG.port}, banco: ${DB_CONFIG.database}`);

  try {
    pool = new pg.Pool({
      ...DB_CONFIG,
      connectionTimeoutMillis: 4000, // Short timeout so local preview is extremely reactive
    });

    // Test query
    const client = await pool.connect();
    console.log("[DB] Conexão PostgreSQL estabelecida com sucesso!");
    isPostgresConnected = true;

    // Create table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        company_name VARCHAR(150),
        project_description TEXT NOT NULL,
        estimated_budget VARCHAR(100),
        urgency VARCHAR(20) NOT NULL,
        created_at VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'under_review',
        ai_analysis JSONB
      );
    `);
    client.release();
    console.log("[DB] Tabela 'contacts' verificada/criada com sucesso no PostgreSQL.");

  } catch (error: any) {
    console.warn("[DB] [AVISO] Não foi possível conectar ao banco PostgreSQL na nuvem ou local:", error.message || error);
    console.warn(`[DB] Usando banco de dados JSON de backup local em: ${fallbackDatabasePath}`);
    isPostgresConnected = false;
  }

  // Create local JSON file default structure if it doesn't exist
  if (!fs.existsSync(fallbackDatabasePath)) {
    writeLocalDb([]);
  }

  return { isPostgres: isPostgresConnected };
}

// Save inquiry (contact)
export async function saveInquiry(inquiry: Inquiry): Promise<void> {
  const { isPostgres } = await initDb();

  if (isPostgres && pool) {
    try {
      await pool.query(
        `INSERT INTO contacts (id, name, email, phone, company_name, project_description, estimated_budget, urgency, created_at, status, ai_analysis)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          inquiry.id,
          inquiry.name,
          inquiry.email,
          inquiry.phone,
          inquiry.companyName,
          inquiry.projectDescription,
          inquiry.estimatedBudget,
          inquiry.urgency,
          inquiry.createdAt,
          inquiry.status,
          JSON.stringify(inquiry.aiAnalysis || null),
        ]
      );
      console.log(`[DB] Inquiry salva com sucesso no PostgreSQL! ID: ${inquiry.id}`);
      return;
    } catch (pgError) {
      console.error("[DB] Erro ao salvar no PostgreSQL, tentando gravar no local de backup...", pgError);
    }
  }

  // Fallback to local file db
  const localDb = readLocalDb();
  localDb.unshift(inquiry); // Add to beginning
  writeLocalDb(localDb);
  console.log(`[DB] Inquiry salva com sucesso no backup LOCAL JSON! ID: ${inquiry.id}`);
}

// Get all inquiries
export async function getAllInquiries(): Promise<Inquiry[]> {
  const { isPostgres } = await initDb();

  if (isPostgres && pool) {
    try {
      const res = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
      return res.rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        phone: row.phone,
        companyName: row.company_name,
        projectDescription: row.project_description,
        estimatedBudget: row.estimated_budget,
        urgency: row.urgency as any,
        createdAt: row.created_at,
        status: row.status as any,
        aiAnalysis: row.ai_analysis,
      }));
    } catch (pgError) {
      console.error("[DB] Erro ao recuperar inquiries do PostgreSQL, lendo do local...", pgError);
    }
  }

  return readLocalDb();
}

// Update status
export async function updateInquiryStatus(id: string, status: Inquiry["status"]): Promise<void> {
  const { isPostgres } = await initDb();

  if (isPostgres && pool) {
    try {
      await pool.query("UPDATE contacts SET status = $1 WHERE id = $2", [status, id]);
      console.log(`[DB] Status da Inquiry ${id} atualizado para ${status} no PostgreSQL.`);
      return;
    } catch (pgError) {
      console.error("[DB] Erro ao atualizar status no PostgreSQL, tentando no local...", pgError);
    }
  }

  // Fallback
  const localDb = readLocalDb();
  const index = localDb.findIndex((x) => x.id === id);
  if (index !== -1) {
    localDb[index].status = status;
    writeLocalDb(localDb);
    console.log(`[DB] Status da Inquiry ${id} atualizado para ${status} no backup LOCAL JSON.`);
  }
}

// Delete inquiry
export async function deleteInquiry(id: string): Promise<void> {
  const { isPostgres } = await initDb();

  if (isPostgres && pool) {
    try {
      await pool.query("DELETE FROM contacts WHERE id = $1", [id]);
      console.log(`[DB] Inquiry ${id} deletada do PostgreSQL.`);
      return;
    } catch (pgError) {
      console.error("[DB] Erro ao deletar no PostgreSQL, deletando no local...", pgError);
    }
  }

  // Fallback
  const localDb = readLocalDb();
  const updated = localDb.filter((x) => x.id !== id);
  writeLocalDb(updated);
  console.log(`[DB] Inquiry ${id} deletada no backup LOCAL JSON.`);
}
