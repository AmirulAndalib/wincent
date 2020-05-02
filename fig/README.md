# Fig: A configuration "framework"

### How this repo works

0. **2009**: Originally, the repo was just a [collection of files](https://github.com/wincent/wincent/tree/61a7e2a830edb757c59e542039131e671da8b154) with no installation script.
1. **2011-2015**: I [created a `bootstrap.rb` script](https://github.com/wincent/wincent/commit/e29b2818c487529eb4e7662a23df56445b448fe3) ([final version here](https://github.com/wincent/wincent/blob/94fb4d50243b97cd0c92a5691ac430353a5299a0/bootstrap.rb)) for performing set-up.
1. **2015**: I [briefly experimented](https://github.com/wincent/wincent/commit/4efdb1f97685bf735b068835adced059cd721096) with using a `Makefile` ([final version here](https://github.com/wincent/wincent/blob/01b37a546b92f60e659a8153067353d58805a009/Makefile)).
1. **2015-2020**: I [switched to Ansible](https://github.com/wincent/wincent/commit/375f27a6ea6fdd78fcf6614d3af5335da7a9f5ef) (completing the transition in [cd98e9aaab](https://github.com/wincent/wincent/commit/cd98e9aaab82b1983aeab839d4f28260d6e19919)).
1. **2020-present**: I started [feeling misgivings about the size of the dependency graph](https://github.com/wincent/wincent/issues/82) and in truth I was probably using less than 1% of Ansible's functionality, so moved to the current set-up, which is described below.

The goal was to replace Ansible with some handmade scripts using the smallest dependency graph possible. I original [tried](https://github.com/wincent/wincent/commit/8809a1681cfd8fd02eb40113d2485d7cadc10e4c) out [Deno](https://deno.land/) because that would enable me to use TypeScript with no dependencies outside of Deno itself, however I [gave up on that](https://github.com/wincent/wincent/commit/a213ddf69d3213882808b5c5ff0e000bcd83fe98) when I saw that editor integration was still very nascent. So I went with the following:

-   [n](https://github.com/tj/n) ([as a submodule](https://github.com/wincent/wincent/tree/master/vendor)) and some [hand-rolled Bash scripts](https://github.com/wincent/wincent/tree/master/bin) to replace [virtualenv](https://virtualenv.pypa.io/) and friends ([Python](https://www.python.org/), [pip](https://pypi.org/project/pip/)).
-   [Yarn](https://github.com/yarnpkg/yarn/) ([vendored](https://github.com/wincent/wincent/commit/26adf86d4c742390537be4dc1572f93a97bc3e68)) to install [TypeScript](https://www.typescriptlang.org/).

Beyond that, there are no dependencies outside of the [Node.js](https://nodejs.org/en/) standard library. I use [Prettier](https://prettier.io/) to format code, but I invoke it via `npx` which means the [yarn.lock](https://github.com/wincent/wincent/blob/master/yarn.lock) remains basically empty. Ansible itself is replaced by [a set of self-contained TypeScript scripts](https://github.com/wincent/wincent/tree/master/src). Instead of YAML configuration files containing "declarative" configuration peppered with Jinja template snippets containing Python and filters, we just use TypeScript for everything. Instead of [Jinja template files](https://jinja.palletsprojects.com/), we use ERB/JSP-like templates that use embedded JavaScript when necessary.

Because I need a name to refer to this "set of scripts", it's called Fig (a play on "Config"). Overall structure remains similar to Ansible, but I made some changes to better reflect the use case here. While Ansible is made to orchestrate multiple (likely remote) hosts, Fig is for configuring one local machine at a time.

| Ansible                                                                                                                         | Fig                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Hosts:** Machines to be configured (possibly remote)                                                                          | n/a (always the current, local machine)                                                                         |
| **Groups:** Collections of hosts, so you can conveniently target multiple hosts without having to address each one individually | **Profiles:** An abstract category indicating the kind of a host (eg. "work" or "personal")                     |
| **Inventory:** A list of hosts (or groups of hosts) to be managed                                                               | n/a ("project.json" file contains map from hostname to profile to be applied)                                   |
| **Roles:** Capabilities that a host can have (eg. webserver, file-server etc)                                                   | **Aspects:** Logical groups of functionality to be configured (eg. dotfiles, terminfo etc)                      |
| **Tasks:** Operations to perform (eg. installing a package, writing a file                                                      | **Tasks:** Same as Ansible.                                                                                     |
| **Plays:** A mapping between hosts (or groups) and the tasks to be performed on them                                            | n/a (it's just a file containing tasks)                                                                         |
| **Playbooks:** Lists of plays                                                                                                   | n/a ("project.json" file contains a map from platform to the aspects that should be set up on a given platform) |
| **Tags:** Keywords that can be applied to tasks and roles, useful for selecting them to be run                                  | n/a (not needed)                                                                                                |
| **Facts:** (Inferred) attributes of hosts                                                                                       | **Attributes:** Same as Ansible, but with a better name                                                         |
| **Vars:** (Declared) values that can be assigned to groups, hosts or roles                                                      | **Vars:** Same as Ansible, but belong to profiles and aspects                                                   |
| **Modules:** Units of code that implement operations (ie. these are what tasks use to actually do the work)                     | **Operations:** Code for performing operations                                                                  |
| **Templates:** Jinja templates with embedded Python and "filters"                                                               | **Templates:** ERB templates with embedded JavaScript                                                           |
| **Files:** Raw files that can be copied using modules                                                                           | **Files:** Raw files that can be copied using operations                                                        |
| **Syntax:** YAML with interpolated Jinja syntax containing Python and variables                                                 | **Syntax:** TypeScript and (plain) JSON                                                                         |