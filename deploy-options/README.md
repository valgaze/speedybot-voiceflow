## Examples

Included in this directory are two "batteries-included" samples that show how to deploy Speedybot on a variety of platforms/infrastucture It doesn't matter if it's Serverless-less/Server-ful, Container-less-- it can run Speedybot.

There's no "best" infrastructure solution but choices/options depending on your setup and requirements.

Grab an example and deploy

| Platform                                                                              | Needs server? | Needs webhooks? |
| ------------------------------------------------------------------------------------- | ------------- | --------------- |
| **[🔌 "Deploy" with websockets](./../src/index.ts)**                                  | YES           | ❌              |
| **[λ Deploy to AWS Lamda](./aws-lambda/README.md)** using **[SST](https://sst.dev/)** | ❌            | ✅              |
| **[🔥 Deploy to Worker](./worker/README.md)**                                         | ❌            | ✅              |
