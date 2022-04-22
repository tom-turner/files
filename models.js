const database = require('./database.json')
const databaseUrl = process.env.NODE_ENV === 'production' ? database.production.filename : database.development.filename

const db = require('better-sqlite3')(databaseUrl);

function generateInsert(table, columns) {
  return ` 
    insert into
    ${table} (${columns.join(', ')})
    values (${columns.map((_, i) => `?`).join(', ')})
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
    where ${columns.map((name, index) => `${name} = ?`).join(' and ')}
    limit 1
  `
}

function generateFindAll(table, columns) {
  return ` 
    select *
    from ${table}
    ${columns.length > 0 ? 'where' : ''} ${columns.map((name, index) => `${name} = ?`).join(' and ')}
  `
}

function generateDelete(table, columns) {
  return `
    delete 
    from ${table} 
    where ${columns.map((name, index) => `${name} = ?`).join(' and ')}
    returning *
  `
}

class Model {
  constructor(tableName, attributeColumnMap = {}) {
    this.tableName = tableName
    this.attributeColumnMap = attributeColumnMap
    this.columnNames = []

    ;(async () => {
      const result = await db.pragma(`table_info(${tableName});`)
      this.columnNames = result.map(r => r.name)
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

    const result = await db.prepare(
      generateInsert(this.tableName, columnsToInsert)
    ).run(valuesToInsert)
   
    return result.lastInsertRowid
  }

  async update(id, values) {
    const [columnsToUpdate, valuesToUpdate] = this.columnsAndValuesFromMap(values)

    const result = await db.prepare(
      generateUpdate(this.tableName, columnsToUpdate),
      [id].concat(valuesToUpdate)
    ).run()

    return result.rows[0]?.id
  } // update is most likely broken after move to sqlite3
    // but no updates in app to test

  async findBy(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await db.prepare(
      generateFind(this.tableName, columnsToFind),
      valuesToFind
    ).all(valuesToFind)

    if(!result.length){
      return null
    }

    return result[0]
  }

  async findAllBy(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await db.prepare(
      generateFindAll(this.tableName, columnsToFind)
    ).all(valuesToFind)

    if(!result.length){
      return []
    }

    return result
  }

  async delete(values) {
    const [columnsToFind, valuesToFind] = this.columnsAndValuesFromMap(values)

    const result = await db.prepare(
      generateDelete(this.tableName, columnsToFind)
    ).run(valuesToFind)

    if(!result){
      return null
    }
    
    return result.lastInsertRowid
  }
}

exports.generateInsert = generateInsert
exports.generateFind = generateFind
exports.generateUpdate = generateUpdate
exports.Model = Model
exports.Files = new Model('files')
exports.Directories = new Model('directories')
exports.Users = new Model('users')
