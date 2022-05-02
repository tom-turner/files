'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  
  await db.addColumn('tags', 'shared', {
    type: 'int',
    default: 0
  });

  await db.addColumn('tags', 'share_slug', {
    type: 'string'
  });

};

exports.down = async function(db) {
  await db.removeColumn('tags', 'shared')

  await db.removeColumn('tags', 'share_slug')

};


exports._meta = {
  "version": 1
};
