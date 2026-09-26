const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const SEED_MEMBERS = [
  ['Aga Atkins', 'agnieszka.atkins@gmail.com'],
  ['Aimee Granados', 'aimee.granados@gmail.com'],
  ['Alex Defries', 'alexdefries@hotmail.com'],
  ['Ali Clarke', 'ali@aliclarkedesign.co.uk'],
  ['Alice Barker', 'aliceannabarker@gmail.com'],
  ['Alice Tearle', 'atearle@stowe.co.uk'],
  ['Alison Rooney', 'robasalon2@aol.com'],
  ['Alison Stone', 'alistone71@outlook.com'],
  ['Alison Wood', 'nozbird@yahoo.co.uk'],
  ['Amy Foley', 'ames35a@hotmail.com'],
  ['Amy Girling', 'amylgirling@gmail.com'],
  ['Andrew Gibson', 'afb.gibson@gmail.com'],
  ['Andy Parry', 'andy.parry@btinternet.com'],
  ['Andy Peat', 'andy@andypeatassociates.co.uk'],
  ['Angus Roche', 's.roche@btinternet.com'],
  ['Anita Stubbings', 'anitastubbings@hotmail.co.uk'],
  ['Ann Hodges-Rider', 'a.hodgesrider@gmail.com'],
  ['Ann Lester', 'annlester177@gmail.com'],
  ['Anna Ciesielska', 'a.ciesielska@hotmail.com'],
  ['Anne Comins', 'cominsanne@gmail.com'],
  ['Annie Jones', 'arjones18@outlook.com'],
  ['Ant Pedder', 'antpedder@icloud.com'],
  ['Anya Dunlop', 'anya_dunlop@hotmail.co.uk'],
  ['Bella Bilney', 'bella.alfaraj@gmail.com'],
  ['Bil Hassan', 'bilhassan@hotmail.co.uk'],
  ['Bob Gregory', 'r13wg@yahoo.co.uk'],
  ['Bridget Clifford', 'bridgetaclifford@gmail.com'],
  ['Bruce Patience', 'brucenpatience@gmail.com'],
  ['Carla Price', 'carlajaneprice@gmail.com'],
  ['Carmel Lane', 'carmel.lane@me.com'],
  ['Carole Lambourne', 'carolelambourne@aol.com'],
  ['Caroline Reece', 'c.reece@hotmail.co.uk'],
  ['Caroline Thomson-Smith', 'cthomsonsmith@gmail.com'],
  ['Charles Illing', 'charlesilling97@gmail.com'],
  ['Charlie Evans', 'charlie75evans@gmail.com'],
  ['Charlie Hall', 'charlieandcharliehall@yahoo.co.uk'],
  ['Chetna Jain', 'chetnadubal@gmail.com'],
  ['Chirag Shah', 'chiragrrshah@gmail.com'],
  ['Chloe Otter', 'chloethornhill@hotmail.com'],
  ['Christopher Epps', 'cmjepps@gmail.com'],
  ['Claire Britton', 'miclairey@hotmail.com'],
  ['Claire Lawrence', 'gaffney_27@hotmail.com'],
  ['Clive Zanker', 'clivezanker@yahoo.co.uk'],
  ['Collette Thompson', 'collette.saward@me.com'],
  ['Corrine Grant', 'corrinej20@gmail.com'],
  ['Crystal Danbury', 'crystalvbromwich@hotmail.com'],
  ['Damon Largent', 'bigpikle@gmail.com'],
  ['Dan Elworthy', 'daniel.elworthy@gmail.com'],
  ['Danny Tomblin', 'danny.tomblin@btopenworld.com'],
  ['Dave Hanchet', 'davehanchet@gmail.com'],
  ['David Bennett', 'dbennett@comptech-ltd.co.uk'],
  ['David Hunt', 'david.hunt@networkrail.co.uk'],
  ['David Neilson', 'neilson.david@icloud.com'],
  ['David Spicer', 'davidjspicer@icloud.com'],
  ['Dawn Rogers', 'wilsondawn@talk21.com'],
  ['Debbie Gibson', 'debbiegibson16@icloud.com'],
  ['Debbie Kelly-Greaves', 'jdf.151@btinternet.com'],
  ['Debs Coxall', 'debbie.coxall@btinternet.com'],
  ['Deepak Kumar', 'deep.kumar@yahoo.co.uk'],
  ['Deryck Lamb', 'derycklamb@hotmail.co.uk'],
  ['Diane Finck', 'dvc54@hotmail.co.uk'],
  ['Dorinda Marfo', 'dorinda1230@yahoo.co.uk'],
  ['Edward Dablin', 'edablin@hotmail.com'],
  ['Elise Craig', 'elise@craigfamily.me.uk'],
  ['Elizabeth White', 'l1z01@hotmail.com'],
  ['Emily Billings', 'emilyannbillings@gmail.com'],
  ['Emily Herbert', 'emilyherbert1998@gmail.com'],
  ['Emily Shepherd', 'emily.allen06@hotmail.co.uk'],
  ['Emma Fellingham', 'emma_fellingham@hotmail.com'],
  ['Fernanda Pellegrini', 'fernanda.pellegrini@gmail.com'],
  ['Fiona Manser', 'info@stevemanser.co.uk'],
  ['Frank Elliott', 'frankelliott555@hotmail.co.uk'],
  ['Freddie Kelly-Greaves', 'fkellygreaves@icloud.com'],
  ['Gemma Hopkin', 'gemmal85@hotmail.com'],
  ['Grace Bloomfield', 'grace.bloomfield@icloud.com'],
  ['Graeme White', 'white.graeme1@gmail.com'],
  ['Graham Barter', 'graham.barter@nhs.net'],
  ['Graham Clements', 'grahamp.clements@sky.com'],
  ['Hannah Muston', 'hannahmuston@hotmail.co.uk'],
  ['Hayley Montague', 'hayleymac03@gmail.com'],
  ['Hayley Pegram', 'hayleypegram@gmail.com'],
  ['Hayley Rimmer', 'hayleyrimmer07@hotmail.com'],
  ['Heather Sequeira', 'heathersequeira@me.com'],
  ['Helen Butcher', 'helen.butcher@live.co.uk'],
  ['Helen Holding', 'holdihel@aol.com'],
  ['Helen Mackenzie', 'hmackenzie65@gmail.com'],
  ['Helen Wooldridge', 'helenwooldridge@yahoo.com'],
  ['Ian Smith', 'ianjsmith664@gmail.com'],
  ['Ian Watkins', 'ian.watkins@consultability.co.uk'],
  ['Imogen Wynn', 'immiwynn73@gmail.com'],
  ['Jacky Alder', 'jackyalderevenley@gmail.com'],
  ['Jacqui Potts', 'jacqui_uk@yahoo.com'],
  ['James Hagon', 'info@countrywoodfloors.co.uk'],
  ['James Tearle', 'jtearle@stowe.co.uk'],
  ['Jan Freeborn', 'janfreeborn@aol.com'],
  ['Jan Kirtley', 'jan.kirtleyjones@gmail.com'],
  ['Jane Butcher', 'janebutcher@hotmail.co.uk'],
  ['Jane Graham', 'mrsjgraham123@gmail.com'],
  ['Jane Miller', 'millerjjr@outlook.com'],
  ['Janice Scarr', 'jandjscarr@gmail.com'],
  ['Janie Wood', 'Janiewood1@mac.com'],
  ['Jennifer Boal', 'boaljennifer@googlemail.com'],
  ['Jennifer Challberg', 'jennifer.challberg@gmail.com'],
  ['Jenny Draper', 'jen.draper@live.co.uk'],
  ['Jenny Margaret Snowdon', 'jennysnowdon@btinternet.com'],
  ['Jenny Rose', 'jennyhrose@gmail.com'],
  ['Jenny Tofield', 'jenny.tofield@live.co.uk'],
  ['Jenny Werren', 'jenny.werren@outlook.com'],
  ['Jenny Yull', 'jennyvyull@gmail.com'],
  ['Jo Morphet', 'jo.morphet@gmail.com'],
  ['Jo Timmins', 'josephinetimmins76@gmail.com'],
  ['Joanna Edwards', 'joannarussell21@hotmail.com'],
  ['Joe Mcgovern', 'pjmcg2508@gmail.com'],
  ['Jonathan Mealey', 'jon.mealey@googlemail.com'],
  ['Judith Bloomfield', 'thebloomfields@sky.com'],
  ['Judy Barker', 'judy_nickols@hotmail.com'],
  ['Julian Scarr', 'scarrjulian@gmail.com'],
  ['Julie Gregory', 'julie1buckingham1@yahoo.co.uk'],
  ['Julie Houston', 'Juliehouston2015@outlook.com'],
  ['Julie Wood', 'jules_pugh@hotmail.com'],
  ['Juliet Clutterbuck', 'jclutterbuck3@gmail.com'],
  ['Justine Norris', 'justine.norris@hotmail.co.uk'],
  ['Karen Cunningham', 'vvbcunningham@aol.com'],
  ['Karen Fitzgerald', 'karen@karenfitzgerald.uk'],
  ['Karen Jones', 'kvtjones@me.com'],
  ['Karen Roche', 'k.roche@btinternet.com'],
  ['Karim Kassam', 'k.kassam@zizhospitality.co.uk'],
  ['Kate Young', 'katie2914@hotmail.com'],
  ['Katherine Gibbard', 'kcgibbard@gmail.com'],
  ['Katherine Spinks', 'katspinks@hotmail.co.uk'],
  ['Katie Harrison', 'katieharr01@gmail.com'],
  ['Kevin Bursnall', 'kevin@racelogic.co.uk'],
  ['Kevin Kolkea', 'k.kolkea@gmail.com'],
  ['Kevin Nicosia', 'kevin@jakana.co.uk'],
  ['Kevin Thompson', 'kevin.s.j.thompson@gmail.com'],
  ['Kimberley Keegan', 'kimberleykeegan@hotmail.co.uk'],
  ['Kimberly Oakman', 'kimwhite16@hotmail.com'],
  ['Lacey Townes', 'letownes@hotmail.com'],
  ['Lara Kirby', 'Lara_Kirby@hotmail.com'],
  ['Laraine Green', 'larainegreen@hotmail.co.uk'],
  ['Laura Mynard', 'lauramyn.lm@gmail.com'],
  ['Lee King', 'lee.king@acco.com'],
  ['Lekshmi Ratheesan', 'lekshmiratheesh993@gmail.com'],
  ['Lindsey McCluskie', 'lindseymccluskie@hotmail.com'],
  ['Lisa Prior', 'lisa.prior148@gmail.com'],
  ['Liz Kehoe', 'liz.kehoe@hotmail.co.uk'],
  ['Louise Cassettari', 'louisecass@btinternet.com'],
  ['Louise Grant', 'louise.grant01@btinternet.com'],
  ['Lucy Barry', 'lucybarry@btconnect.com'],
  ['Lucy Draper', 'lucydraper1@outlook.com'],
  ['Lucy Ellis', 'lucyjane.ellis@icloud.com'],
  ['Luke Ford', 'lukeford38@gmail.com'],
  ['Lynn Ferguson', 'lynnsdolphin@hotmail.com'],
  ['Maggie Hogg', 'maggie.hogg@outlook.com'],
  ['Manpreet Kaur', 'manpreet.agarwal@gmail.com'],
  ['Marcelo Granado Dantas', 'marcelogranado@hotmail.com'],
  ['Mark Carter', 'mcarterbrickwork@hotmail.co.uk'],
  ['Mark Fogarty', 'mark.fogarty@hotmail.co.uk'],
  ['Mark Rees', 'mark.rees8800@gmail.com'],
  ['Mel Bull', 'melb3882@gmail.com'],
  ['Michael Palmer', 'mike.palme@gmail.com'],
  ['Michelle Lascelles', 'michelle@lascelles.org'],
  ['Mike Potts', 'mike.g.potts@btinternet.com'],
  ['Natalie Cockayne', 'natalie.cockayne@outlook.com'],
  ['Naveed Sheikh', 'Nav_sheikh@hotmail.com'],
  ['Neha Shah', 'tamishah80@hotmail.com'],
  ['Neil Ackerman', 'neilackerman@live.co.uk'],
  ['Neil King', 'neilk7@icloud.com'],
  ['Nell Payne', 'nellpayne@hotmail.com'],
  ['Nick Jackson', 'nick@nicholasjackson.co.uk'],
  ['Nicola Putt', 'nicola_putt@hotmail.com'],
  ['Nigel Beeken', 'nigel.beeken@btinternet.com'],
  ['Nikki Fhalora', 'nicolafhalora@hotmail.com'],
  ['Oliver Bilney', 'info@ollieandash.co.uk'],
  ['Paul Campbell', 'pitchforkdon@gmail.com'],
  ['Paul Newman', 'newman.rhodes@gmail.com'],
  ['Paul Snell', 'paulspace@hotmail.com'],
  ['Pauline Hardman', 'pauline.hardman@icloud.com'],
  ['Penny Watts', 'pawatts99@gmail.com'],
  ['Phil Metcalfe', 'philmet1@gmail.com'],
  ['Phil Smith', 'philksmith1@btinternet.com'],
  ['Ploy Radford-Taylor', 'ploy.radford@gmail.com'],
  ['Prasobh Prathapan', 'prasobh46@gmail.com'],
  ['Rehela Sheikh', 'rehela@hotmail.com'],
  ['Reva Cope', 'reva.cope@gmail.com'],
  ['Richard Cole', 'rg.cole@live.co.uk'],
  ['Richard Fletcher', 'richard.p.fletcher@outlook.com'],
  ['Richard Jones', 'richardejjones@gmail.com'],
  ['Richard Roach', 'richardwroach@gmail.com'],
  ['Rob Brown', 'rtbrown_101@yahoo.co.uk'],
  ['Rob Shoebridge', 'ccmqueretaro@gmail.com'],
  ['Rob Street', 'robcstreet@gmail.com'],
  ['Rob Trice', 'rob_trice@hotmail.co.uk'],
  ['Robert Firbank', 'robert@firbank.net'],
  ['Roland Smith', 'rolandsmith1943@hotmail.co.uk'],
  ['Rosalie Briant', 'rosaliebriant@hotmail.com'],
  ['Russell Cooley', 'russellcooley123@icloud.com'],
  ['Russell Jones', 'drljones66@gmail.com'],
  ['Ruth Wooderson', 'ruthwooderson4@gmail.com'],
  ['Ryan Lane', 'slaney007@hotmail.com'],
  ['Sam Gill', 'sam@exceller.org'],
  ['Sarah Johnson', 'scordes601@gmail.com'],
  ['Sarah Powell', 'sarah@reid-co.co.uk'],
  ['Sarah Skelly', 'sarahskelly@hotmail.co.uk'],
  ['Saurabh Agarwal', 'talktosaurabh@gmail.com'],
  ['Scott Knight', 'scott.knight08@gmail.com'],
  ['Shannon Horton', 'shannonlhorton@yahoo.com'],
  ['Shanti Persaud', 'shanti_persaud@hotmail.com'],
  ['Sharon Crossman', 'wjc@sky.com'],
  ['Sharon Macnab', 'sharonmacnab@hotmail.co.uk'],
  ['Sharon Morgan', 'morgan_sharon1@outlook.com'],
  ['Sharon Roach', 'shaaroach@gmail.com'],
  ['Shirley Rogers', 'shirley.anne.rogers.sar@gmail.com'],
  ['Simon Bateman', 'si_bateman@yahoo.co.uk'],
  ['Smita Khanijow', 'smita.khanijow@gmail.com'],
  ['Stephanie Orr', 'hello@flat102.co.uk'],
  ['Steve Jones', 'smjones964@gmail.com'],
  ['Steve Manser', 'steve.manser@borngroup.com'],
  ['Steve Wood', 'steve@autofarm.co.uk'],
  ['Sue Dadswell', 'suedadswell1@gmail.com'],
  ['Sue Yapp', 'suyapp@gmail.com'],
  ['Sue Zanker', 'susan.zanker@yahoo.co.uk'],
  ['Susan Williams', 'peaches559@hotmail.co.uk'],
  ['Suzie Snelson', 'suzie.snelson@btinternet.com'],
  ['Sylvia Patchett', 'sylvia.patchett@hotmail.co.uk'],
  ['Tanya Coles', 'tanyajillcoles@yahoo.com'],
  ['Tatenda Sibanda', 'claratsibanda@gmail.com'],
  ['Tess Watkins', 'tess-watkins@hotmail.co.uk'],
  ['Tim Barker', 'timbarkeruk@hotmail.com'],
  ['Tom Watson', 'tom.watson01@aol.co.uk'],
  ['Tony Grant', 'tonygrant.tcg@gmail.com'],
  ['Tracey Largent', 'traceylargent@gmail.com'],
  ['Tracy Allen', 'tracyallen375@gmail.com'],
  ['Tyrone Mathews', 'tyronemathews@hotmail.co.uk'],
  ['Veronica Peat', 'vjsb1@icloud.com'],
  ['Vikki James', 'vikkisly1@icloud.com'],
  ['Viv Williams', 'viv-williams@hotmail.co.uk'],
  ['Wendy Lawrence', 'w.lawrence.lunt@gmail.com'],
  ['Wendy Melendez', 'wendy.melendez@yahoo.co.uk'],
  ['Zoe Jones', 'zcjjones@gmail.com'],
  ['Zoe Wilbourne', 'zoewilbourne@hotmail.com'],
];

async function init() {
  await pool.query('CREATE EXTENSION IF NOT EXISTS citext');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS members (
      id    SERIAL PRIMARY KEY,
      name  TEXT NOT NULL,
      email TEXT UNIQUE
    )
  `);

  // Migration: add email column to pre-existing members table if absent
  await pool.query(`ALTER TABLE members ADD COLUMN IF NOT EXISTS email TEXT`);
  await pool.query(`CREATE UNIQUE INDEX IF NOT EXISTS idx_members_email ON members(email)`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tokens (
      id         SERIAL PRIMARY KEY,
      email      TEXT        NOT NULL,
      token      TEXT        NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      used       BOOLEAN     DEFAULT FALSE
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sessions (
      id         SERIAL PRIMARY KEY,
      member_id  INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
      lift       TEXT    NOT NULL,
      date       TEXT    NOT NULL,
      is_pb      INTEGER NOT NULL DEFAULT 0,
      comments   TEXT    NOT NULL DEFAULT '',
      logged_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS sets (
      id         SERIAL PRIMARY KEY,
      session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      kg         REAL    NOT NULL,
      reps       INTEGER NOT NULL
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_sessions_member_lift ON sessions(member_id, lift)
  `);

  // Seed members — two passes:
  // 1. Update existing name-matched rows with email (preserves session history)
  // 2. Insert/update by email for any not yet present
  const names  = SEED_MEMBERS.map(([n]) => n);
  const emails = SEED_MEMBERS.map(([, e]) => e);
  const vals   = SEED_MEMBERS.map((_, i) => `($${i * 2 + 1}, $${i * 2 + 2})`).join(',');
  const params = SEED_MEMBERS.flatMap(([n, e]) => [n, e]);

  await pool.query(
    `UPDATE members m SET email = v.email
     FROM (VALUES ${vals}) AS v(name, email)
     WHERE LOWER(m.name) = LOWER(v.name) AND m.email IS NULL`,
    params
  );

  await pool.query(
    `INSERT INTO members (name, email)
     SELECT v.name, v.email FROM (VALUES ${vals}) AS v(name, email)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name`,
    params
  );
}

module.exports = { pool, init };
