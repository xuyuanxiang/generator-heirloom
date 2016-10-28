var generators = require("yeoman-generator");
var _ = require("lodash");

module.exports = generators.Base.extend({
    constructor: function () {
        generators.Base.apply(this, arguments);
        this.argument("name", {desc: 'your project name', type: String});
        this.version = this.config.get('version') || "1.0.0";
        this.description = this.config.get('description') || "";
    },
    initializing: function () {
        this.author = this.config.get('author');
        var choices = []
            , user = this.user
            , git = user.git
            , gitName = git.name()
            , gitEmail = git.email();
        this.author && choices.push(this.author);
        gitName && choices.push(gitName);
        gitEmail && choices.push(gitEmail);
        this.authorChoices = _.uniq(choices);
    },
    prompting: {
        name: function () {
            if (this.name !== _.kebabCase(this.name)) {
                return this.prompt([
                    {
                        type: "input",
                        name: "name",
                        message: "\"" + this.name + "\" is an invalid project name. Please retype:",
                        default: _.kebabCase(this.name),
                        validate: function (input) {
                            if (input !== _.kebabCase(input)) {
                                return "Sorry, project name can no longer contain capital letters.";
                            }
                            return true;
                        }
                    }
                ]).then(function (answers) {
                    this.name = answers.name;
                }.bind(this));
            }
        },
        version: function () {
            return this.prompt([{
                type: "input",
                name: "version",
                message: "version:",
                default: this.version,
                validate: function (input) {
                    if (!/^\d+\.\d+\.\d+$/.test(input)) {
                        return "Invalid version: \"" + input + "\", ";
                    }
                    return true;
                }
            }]).then(function (answers) {
                this.version = answers.version;
                this.config.set('version', this.version);
            }.bind(this));
        },
        description: function () {
            return this.prompt([{
                type: "input",
                name: "description",
                message: "description:",
                default: this.description
            }]).then(function (answers) {
                if (answers.description) {
                    this.description = answers.description;
                    this.config.set('input description', this.description);
                }
            }.bind(this));
        },
        author: function () {
            var promise;
            if (this.authorChoices.length > 1) {
                promise = this.prompt([{
                    type: "list",
                    name: "author",
                    message: "author choices:",
                    choices: this.authorChoices,
                    default: this.author
                }]);
            } else {
                promise = this.prompt([{
                    type: "input",
                    name: "author",
                    message: "author:",
                    default: this.author
                }]);
            }
            return promise.then(function (answers) {
                if (answers.author) {
                    this.author = answers.author;
                    this.config.set('author', this.author);
                }
            }.bind(this));
        },
        isOk: function () {
            var json = _.pick(this, ['name', 'version', 'description', 'author']);
            return this.prompt([{
                type: 'confirm',
                name: 'isOk',
                message: JSON.stringify(json, null, 2) + '\n is ok ?',
                default: true
            }]).then(function (answers) {
                if (answers.isOk === true) {
                    this.package = json;
                }
            }.bind(this));
        }
    },
    configuring: {
        packageJSON: function () {
            if (!this.package) {
                this.log('Bye!');
                process.exit(1);
            }
            this.log('configuring:' + this.package);
        }
    },
    exec: function () {
        // this.spawnCommandSync('git', ['clone', 'https://github.com/xuyuanxiang/heirloom-seed.git', this.name]);
        // this.spawnCommandSync('rm', ['-rf', './' + this.name + '/.git']);
        this.log('destinationRoot:\t' + this.destinationRoot());
        this.log('sourceRoot:\t' + this.sourceRoot());
    },
});