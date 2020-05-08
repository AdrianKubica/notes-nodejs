"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var typegoose_1 = require("@typegoose/typegoose");
var connecttionURL = 'mongodb://192.168.99.110/task-manager-api';
mongoose_1.default.connect(connecttionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typegoose_1.prop({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "name", void 0);
    __decorate([
        typegoose_1.prop({ required: true }),
        __metadata("design:type", Number)
    ], User.prototype, "age", void 0);
    return User;
}());
exports.User = User;
var userSchema = typegoose_1.buildSchema(User);
var UserModel = typegoose_1.addModelToTypegoose(mongoose_1.default.model('User', userSchema), User);
var user = new UserModel({
    name: 'Adrian'
});
user.save().then(function (result) {
    console.log(result);
}).catch(function (error) {
    console.log(error);
});
// interface User {
//     name: string,
//     age: number
//   }
// const definition: ModelDefinition<User> = {
//     name: { type: String, required: true },
//     age: { type: Number, required: true },
// };
// const userSchema = new mongoose.Schema(definition)
// const User = mongoose.model<User & mongoose.Document>('User', userSchema)
// const me = new User({
//     name: 28,
//     age: 'mike'
// })
// me.save().then(result => {
//     console.log(result)
// }).catch(error => {
//     console.log(error)
// })
// interface Test {
//     testa: string
// }
// interface Task {
//     description: string,
//     completed: boolean,
//     test: Test
// }
// const taskDefinition: ModelDefinition<Task> = {
//     description: { type: String, required: true },
//     completed: { type: Boolean, required: true },
//     test: {type: String, required: true}
// }
// const taskSchema = new mongoose.Schema(taskDefinition)
// const Task = mongoose.model<Task & mongoose.Document>('Task', taskSchema)
// const task = new Task({
//     description: "First task",
//     completed: true
// })
// task.save().then(result => {
//     console.log('Saved')
// }).catch(error => {
//     console.log('Unable to save')
// })
