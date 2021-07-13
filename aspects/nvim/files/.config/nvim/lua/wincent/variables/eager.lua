local eager = function()
  vim.g.WincentQuickfixStatusline =
        '%7*' ..
        [[%{luaeval("require'wincent.statusline'.lhs()")}]] ..
        '%*' ..
        '%4*' ..
        '' ..
        ' ' ..
        '%*' ..
        '%3*' ..
        '%q' ..
        ' ' ..
        '%{get(w:,"quickfix_title","")}' ..
        '%*' ..
        '%<' ..
        ' ' ..
        '%=' ..
        ' ' ..
        '' ..
        '%5*' ..
        [[%{luaeval("require'wincent.statusline'.rhs()")}]] ..
        '%*'
end

return eager