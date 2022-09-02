local fmt = string.format

-- Look at first line of `package.config` for directory separator.
-- See: http://www.lua.org/manual/5.2/manual.html#pdf-package.config
local separator = string.match(package.config, '^[^\n]')

-- Search in Lua `package.path` locations.
local search_package_path = function (fname)
  local paths = string.gsub(package.path, "%?", fname)
  for path in string.gmatch(paths, '[^%;]+') do
    if vim.fn.filereadable(path) == 1 then
      return path
    end
  end
end

-- Search in nvim 'runtimepath' directories.
local search_runtimepath = function(fname, ext)
  local candidate
  for _, path in ipairs(vim.api.nvim_list_runtime_paths()) do
    -- Look for "lua/*.lua".
    candidate = table.concat({ path, ext, fmt("%s.%s", fname, ext) }, separator)
    if vim.fn.filereadable(candidate) == 1 then
      return candidate
    end
    -- Look for "lua/*/init.lua".
    candidate = table.concat({ path, ext, fname, fmt("init.%s", ext) }, separator)
    if vim.fn.filereadable(candidate) == 1 then
      return candidate
    end
  end
end

-- Global function that searches the path for the required file
local includeexpr = function (fname)
  fname = vim.fn.substitute(fname, '\\.', separator, 'g')
  return search_package_path(fname) or
    search_runtimepath(fname, 'lua') or
    search_runtimepath(fname, 'fnl')
end

return includeexpr
