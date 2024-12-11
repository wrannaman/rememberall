 ENV=$1
if [ -z "$ENV" ]
then
      echo "\$ENV is should be 'dev', 'stage', or 'prod'"
      exit
fi
echo Building for $ENV

docker build -t us-central1-docker.pkg.dev/user-attribution-434204/secretagent/app:$ENV .
docker push us-central1-docker.pkg.dev/user-attribution-434204/secretagent/app:$ENV

gcloud config set project user-attribution-434204
gcloud run deploy secretagent-landing \
--region us-central1 \
--allow-unauthenticated \
--max-instances 1 \
--image us-central1-docker.pkg.dev/user-attribution-434204/secretagent/app:$ENV 
gcloud config set project user-attribution-434204
