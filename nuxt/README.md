# Бизнес процессы в карточках
```
sudo docker run -d \
    --name postgres-pipecrm \
    -p 5444:5432 \
    -e POSTGRES_USER=pipecrm \
    -e POSTGRES_PASSWORD=pipecrm \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v /var/www/pipecrm/postgresql:/var/lib/postgresql/data \
    postgres:latest
```

```
CREATE USER pipecrm WITH PASSWORD 'pipecrm';
CREATE DATABASE pipecrm;
GRANT ALL PRIVILEGES ON DATABASE "pipecrm" to pipecrm;
ALTER DATABASE pipecrm OWNER TO pipecrm;
```
