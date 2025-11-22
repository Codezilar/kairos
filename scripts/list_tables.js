const fs=require('fs');
const {Client}=require('pg');
const env=fs.readFileSync('.env.local','utf8');
const m=env.match(/^DATABASE_URL=(.*)$/m);
const url=m?m[1].trim().replace(/^['"]|['\"]$/g,''):process.env.DATABASE_URL;
console.error('Using URL (redacted):', url.replace(/:\/\/[^@]+@/,'://<REDACTED>@'));
(async ()=>{
  try{
    const c=new Client({connectionString:url});
    console.error('Connecting...');
    await c.connect();
    console.error('Connected.');
    const res1=await c.query("SELECT table_schema, table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog','information_schema') ORDER BY table_schema, table_name;");
    console.error('information_schema row count:', res1.rowCount);
    console.log('information_schema results:');
    console.log(res1.rows.map(r=>`${r.table_schema}.${r.table_name}`).join('\n') || '<no rows>');

    const res2=await c.query("SELECT schemaname, tablename FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') ORDER BY schemaname, tablename;");
    console.error('pg_tables row count:', res2.rowCount);
    console.log('pg_tables results:');
    console.log(res2.rows.map(r=>`${r.schemaname}.${r.tablename}`).join('\n') || '<no rows>');

    await c.end();
    console.error('Disconnected.');
  }catch(e){
    console.error('ERROR full:', e);
    process.exit(1);
  }
})();
