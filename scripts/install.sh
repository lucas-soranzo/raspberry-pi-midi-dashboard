sudo apt-get install python3 python3-venv python3-dev libasound2-dev libjack-dev supervisor

python3 -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt

cp midi-dashboard.conf /etc/supervisor/conf.d

supervisorctl update