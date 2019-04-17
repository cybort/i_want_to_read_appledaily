require 'rake/packagetask'
require 'json'

manifest = JSON.parse(File.read(File.join(__dir__, 'manifest.json')))
version = manifest['version']

Rake::PackageTask.new('i_want_to_read_appledaily', version) do |pkg|
  pkg.need_zip = true
  pkg.package_files.include('src/main.js', 'manifest.json')
end

task default: :package