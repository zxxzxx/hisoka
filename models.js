var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _User = new Schema({
    email:String,
    name:String,
    passwd:String,
    salt:String
});
var _Item = new Schema({
    name:String,
    item:String,
    payload:{},
    modules:{}
});
var _Victim = new Schema({
    name:String,
    id:String,
    who:String,
    payload:{},
    modules:{},
    status:{},
    now:String
});
var _Page = new Schema({
    name:String,
    uri:String,
    type:String,
    module:{}
});

exports.User = mongoose.model('User', _User);
exports.Item = mongoose.model('Item', _Item);
exports.Victim = mongoose.model('Victim', _Victim);
exports.Page = mongoose.model('Page', _Page);
exports.Db = 'mongodb://'+
    process.env.OPENSHIFT_MONGODB_DB_USERNAME+':'+
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD+'@'+
    process.env.OPENSHIFT_MONGODB_DB_HOST+':'+
    process.env.OPENSHIFT_MONGODB_DB_PORT+'/hisoka';
