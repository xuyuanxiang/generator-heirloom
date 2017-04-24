const Generator = require("yeoman-generator");
const fs = require("fs");
const _ = require("lodash");

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.argument('name', { type: String, required: true, desc: 'your project name' });
        this.options.version = this.config.get('version') || "1.0.0";
        this.options.description = this.config.get('description') || "";
    }

    initializing() {
        const choices = [];
        const user = this.user;
        const git = user.git;
        const gitName = git.name();
        const gitEmail = git.email();
        this.author = this.config.get('author');
        if (this.author) {
            choices.push(this.author);
        }
        if (gitName) {
            choices.push(gitName);
        }
        if (gitEmail) {
            choices.push(gitEmail);
        }
        this.authorChoices = _.uniq(choices);
    }

    prompting() {
        return this.prompt([
            {
                type: "input",
                name: "name",
                when: this.options.name !== _.kebabCase(this.options.name),
                message: `"${this.options.name}" is an invalid project name. Please retype:`,
                default: _.kebabCase(this.options.name),
                validate: (input) => {
                    if (input !== _.kebabCase(input)) {
                        return "Sorry, project name can no longer contain capital letters.";
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "version",
                message: "version:",
                default: this.options.version,
                validate: (input) => {
                    if (!/^\d+\.\d+\.\d+$/.test(input)) {
                        return `Invalid version: "${input}", `;
                    }
                    return true;
                },
            },
            {
                type: "input",
                name: "description",
                message: "description:",
                default: this.options.description,
            },
            {
                type: "list",
                name: "author",
                message: "author choices:",
                choices: this.authorChoices,
                default: this.options.author,
                when: this.authorChoices.length > 1,
            },
            {
                type: "input",
                name: "author",
                message: "author:",
                default: this.options.author,
                when: this.authorChoices.length <= 1,
            },
        ]).then((answers) => {
            this.options.version = answers.version;
            this.config.set('version', this.options.version);
            if (answers.description) {
                this.options.description = answers.description;
                this.config.set('input description', this.options.description);
            }
            if (answers.author) {
                this.options.author = answers.author;
                this.config.set('author', this.options.author);
            }
            this.package = _.pick(this.options, ['name', 'version', 'description', 'author']);
        });
    }

    configuring() {
        if (!this.package) {
            this.log('Bye!');
            process.exit(1);
        }
    }

    exec() {
        this.spawnCommandSync('git', ['clone', 'https://github.com/xuyuanxiang/heirloom-seed.git', this.options.name]);
        this.destinationRoot(this.destinationPath(this.options.name));
        this.spawnCommandSync('rm', ['-rf', '.git']);
        const pkgFile = this.destinationPath('package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgFile, { encoding: 'utf8' }));
        fs.writeFileSync(pkgFile, JSON.stringify(Object.assign({}, pkg, this.package)));
    }

    install() {
        this.installDependencies({
            npm: false,
            bower: false,
            yarn: true,
        });
    }

};
