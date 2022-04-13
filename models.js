const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // only connect with ssl in production (heroku)
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
})

function generateInsert(table, columns) {
  return ` 
    insert into
    ${table} (${columns.join(', ')})
    values (${columns.map((_, i) => `$${i + 1}`).join(', ')})
    returning id
  `
}

function generateUpdate(table, columns) {
  return `
    update ${table}
    set ${columns.map((name, index) => `${name} = $${index + 2}`).join(', ')}
    where id = $1
  `
}

function generateFind(table, columns) {
  return ` 
    select *
    from ${table}
    where ${columns.map((name, index) => `${name} = $${index + 1}`).join(' and ')}
    limit 1
  `
}

function generateFindAll(table, columns) {
  return ` 
    select *
    from ${table}
    ${columns.length > 0 ? 'where' : ''} ${columns.map((name, index) => `${name} = $${index + 1}`).join(' and ')}
  `
}

function generateDelete(table, columns) {
  return `
    delete 
    from ${table} 
    where ${columns.map((name, index) => `${name} = $${index + 1}`).join(' and ')}
    returning *
  `
}

class Model {
  constructor(tableName, attributeColumnMap = {}) {
    this.tableName = tableName
    this.attributeColumnMap = attributeColumnMap
    this.columnNames = []

    ;(async () => {
      const result = await pool.query(`
        select column_name
        from information_schema.columns
        where table_name = '${tableName}'
      `)

      this.columnNames = result.rows.map(r => r.column_name)
    })()
  }

  columnsAndValuesFromMap(map) {
    const attributes = Object.keys(map)
    const columns = attributes.map(a => this.attributeColumnMap[a] || a)

    if (!columns.every(c => this.columnNames.includes(c))) {
      const erroneousColumns = columns.filter(c => !this.columnNames.includes(c))
      throw new Error(`${erroneousColumns.join(', ')} don't exist on the ${this.tableName} table`)
    }

    const values = attributes.map(a => map[a])

    return [columns, values]
  }

  async create(values) {
    const [columnsToInsert, valuesToInsert] = this.columnsAndValuesFromMap(values)

    const result = await pool.query(
      generateInsert(this.tableName, columnsToInsert),
      valuesToInsert
    )

    return result.rows[0].id
  }

  async update(id, values) {
    const [columnsToUpdate, valuesToUpdate] = this.columnsAndValuesFromMap(values)

    const result = await pool.query(
      generateUpdate(this.tableName, columnsToUpdate),
      [id].concat(valuesToUpdate)
    )

    return result.rows[0]?.id
  }

  async findBy(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await pool.query(
      generateFind(this.tableName, columnsToFind),
      valuesToFind
    )

    if(!result){
      return null
    }

    return result.rows[0]
  }

  async findAllBy(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await pool.query(
      generateFindAll(this.tableName, columnsToFind),
      valuesToFind
    )

    if(!result){
      return null
    }

    return result.rows
  }

  async delete(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await pool.query(
      generateDelete(this.tableName, columnsToFind),
      valuesToFind
    )

    if(!result){
      return null
    }

    return result.rows
  }
}

exports.pool = pool
exports.generateInsert = generateInsert
exports.generateFind = generateFind
exports.generateUpdate = generateUpdate
exports.Model = Model
exports.Files = new Model('files')
exports.Directories = new Model('directories')
