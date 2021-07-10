local wincent = require'wincent'

wincent.vim.plaintext()

-- Can't just use 'colorcolumn' here because it's really only the first
-- line whose length we care about, and our focus tricks elsewhere would
-- overwrite it for us anyway.
vim.fn.matchaddpos('ErrorMsg', {{1, 72, 1000}})
