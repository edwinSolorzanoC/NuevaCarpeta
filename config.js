
import {config} from "dotenv";

config()

export const AWS_BUCKET = process.env.AWS_BUCKET
export const AWS_REGION = process.env.AWS_REGION
export const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY
export const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY
