local augroup = wincent.vim.augroup
local autocmd = wincent.vim.autocmd

augroup('WincentAutocmds', function()
  autocmd('BufEnter', '*', wincent.autocmds.buf_enter)
  autocmd('BufLeave', '?*', wincent.autocmds.buf_leave)
  autocmd('BufWinEnter', '?*', wincent.autocmds.buf_win_enter)
  autocmd('BufWritePost', '*/spell/*.add', 'silent! :mkspell! %')
  autocmd('BufWritePost', '?*', wincent.autocmds.buf_write_post)
  autocmd('CmdlineChanged', '*', wincent.autocmds.cmdline_changed)
  autocmd('FileType', '*', wincent.autocmds.file_type)
  autocmd('FocusGained', '*', wincent.autocmds.focus_gained)
  autocmd('FocusLost', '*', wincent.autocmds.focus_lost)
  autocmd('InsertEnter', '*', wincent.autocmds.insert_enter)
  autocmd('InsertLeave', '*', wincent.autocmds.insert_leave)
  autocmd('InsertLeave', '*', 'set nopaste')
  autocmd('TextYankPost', '*', "silent! lua vim.highlight.on_yank {higroup='Substitute', timeout=200}")
  autocmd('VimEnter', '*', wincent.autocmds.vim_enter)
  autocmd('VimResized', '*', 'execute "normal! \\<c-w>="')
  autocmd('WinEnter', '*', wincent.autocmds.win_enter)
  autocmd('WinLeave', '*', wincent.autocmds.win_leave)
end)
