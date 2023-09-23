# Steps to set up terrraform on github actions

1. At aws console, create an S3 bucket to store our tf state
   store the bucket name somewhere as AWS_BUCKET_NAME

2. At aws console, create an IAM identity provider:

   - For Provider type, select OpenID Connect.
   - For Provider URL, enter https://token.actions.githubusercontent.com
   - Click on Get thumbprint to get the thumbprint of the provider
   - For Audience, enter sts.amazonaws.com

3. Create an iam policy to allow github to provision AWS resources
   This is an example that allows github to provision all the resources needed in this project.
   To provision more fine-grained policies, you can refer to the [AWS IAM Policy Generator](https://awspolicygen.s3.amazonaws.com/policygen.html)
   ```json
   {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::<your bucket>"
        },
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject"
            ],
            "Resource": "arn:aws:s3:::<your bucket>/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:*"
            ],
            "Resource": "arn:aws:dynamodb:*:*:table/*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "apigateway:*",
                "cloudwatch:*",
                "logs:*",
                "iam:*",
                "sns:*",
                "lambda:*"
            ],
            "Resource": "*"
        }
    ]
   }
   ```

4. At AWS console, create an IAM role:

   - For Trusted entity, select Web identity.
   - github organization: put user name of your github account
   - github repo: put the name of the repo
   - github branch: put the name of the branch
   - attach the policy created in the previous step

5. Copy the ARN as AWS ROLE

6. At github > settings > security > secrets and variables > actions
   select new repository secret and add the following secrets:

- AWS_REGION &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(e.g. ap-southeast-1)
- AWS_ROLE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (e.g. arn:aws:iam::123456789012:role/github-actions-role)
- AWS_BUCKET_NAME&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(e.g. my-terraform-state-bucket)
- AWS_BUCKET_KEY_NAME &nbsp;&nbsp;&nbsp;&nbsp;(this is the name of the tfstate file, e.g. terraform.tfstate)

### Note

- There will be a workflow to terraform destroy "Manual Infrastructure Destruction" by terraform-destroy.yml
- The terraform-apply.yml will be triggered by push to master branch if there are changes in the /terraform directory only

### Total items for manual creation:

**IAM resources:**

- 1x policy
- 1x role
- 1x provider

**S3 resources:**

- 1x bucket
