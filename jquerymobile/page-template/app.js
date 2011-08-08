 var couchapp = require('couchapp')
  , path = require('path')
  ;

ddoc = 
  { _id:'_design/app'
  , rewrites : 
    [ {from:"/", to:'index.html'}
    , {from:"cache.manifest", to:'_show/cachemanifest'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ]
  }
  ;

ddoc.shows = {};

ddoc.shows.cachemanifest = function(head, req) {
  var manifest = "";
  for (var a in this._attachments) {
    manifest += ("" + a + "\n");
  }
  
  // Outside scripts
  manifest += "http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.css\n";
  manifest += "http://code.jquery.com/jquery-1.6.2.min.js\n";
  manifest += "http://code.jquery.com/mobile/1.0b2/jquery.mobile-1.0b2.min.js\n";
  manifest += "http://code.jquery.com/mobile/1.0b2/images/ajax-loader.png\n";
  
  var r =
    { "headers": { "Content-Type": "text/cache-manifest", "Etag":this._rev}
    , "body": "CACHE MANIFEST\n" + '# rev ' + this._rev + '\n' + manifest
    }
  return r;
}

ddoc.views = {};

ddoc.validate_doc_update = function (newDoc, oldDoc, userCtx) {   
  if (newDoc._deleted === true && userCtx.roles.indexOf('_admin') === -1) {     
    throw "Only admin can delete documents on this database.";
  } 
}

couchapp.loadAttachments(ddoc, path.join(__dirname, 'attachments'));

module.exports = ddoc;