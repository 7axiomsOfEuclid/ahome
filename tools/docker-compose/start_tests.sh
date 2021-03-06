set +x
cd /awx_devel
make clean
cp -R /tmp/awx.egg-info /awx_devel/ || true
sed -i "s/placeholder/$(cat /awx_devel/VERSION)/" /awx_devel/awx.egg-info/PKG-INFO
cp /tmp/awx.egg-link /venv/awx/lib/python2.7/site-packages/awx.egg-link

cp awx/settings/local_settings.py.docker_compose awx/settings/local_settings.py
make test
