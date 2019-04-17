require 'rake/packagetask'
require 'json'

manifest = JSON.parse(File.read(File.join(__dir__, 'manifest.json')))
version = manifest['version']

Rake::PackageTask.new('i_want_to_read_appledaily', version) do |pkg|
  pkg.package_files.include('src/**/*', 'manifest.json')
  file "#{pkg.package_dir}/#{pkg.zip_file}" => [pkg.package_dir_path] + pkg.package_files do |_task|
    chdir(pkg.package_dir_path) { sh pkg.zip_command, '-r', pkg.zip_file, '.' }
    mv "#{pkg.package_dir_path}/#{pkg.zip_file}", pkg.package_dir
  end
  task default: "#{pkg.package_dir}/#{pkg.zip_file}"
end
