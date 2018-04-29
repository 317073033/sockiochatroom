//mongo数据库配置
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
mongoose.connect('mongodb://localhost:27017/chatroom');
const connection = mongoose.connection;
connection.on('error',function(err){
  console.log(err);
});

connection.on('open',function(){
  console.log('open');
});

const accountmodel = new Schema(require('./models/accountmodel'));
accountmodel.plugin(passportLocalMongoose);//takes care of salting and hashing the password
const Account = mongoose.model('Account',accountmodel);

module.exports = {Account};
