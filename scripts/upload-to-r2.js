#!/usr/bin/env node
// scripts/upload-to-r2.js
//
// Upload 1 file lên Cloudflare R2 (S3-compatible API, @aws-sdk/client-s3).
// Dùng để lưu dev-client APK (app-debug.apk) sau khi `eas build --local`,
// thay vì chỉ giữ artifact GitHub (có hạn 7–90 ngày).
//
// Cách dùng:
//   node scripts/upload-to-r2.js ./app-debug.apk [object-key]
//
// Env (GitHub secrets, đặt theo mẫu web CI):
//   CLOUDFLARE_ACCOUNT_ID   → suy ra endpoint: https://<id>.r2.cloudflarestorage.com
//   R2_ACCESS_KEY_ID
//   R2_SECRET_ACCESS_KEY
//   R2_BUCKET_NAME
//   R2_ENDPOINT             (optional, ghi đè endpoint nếu bucket không phải Cloudflare)
//   R2_PUBLIC_BASE_URL      (optional, in URL public sau upload)

const fs = require('node:fs/promises');
const path = require('node:path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

function fail(message) {
  console.error(`[upload-to-r2] ${message}`);
  process.exit(1);
}

function resolveEndpoint() {
  if (process.env.R2_ENDPOINT) return process.env.R2_ENDPOINT;
  if (process.env.CLOUDFLARE_ACCOUNT_ID) {
    return `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;
  }
  fail('Thiếu R2_ENDPOINT hoặc CLOUDFLARE_ACCOUNT_ID để xác định endpoint.');
}

async function main() {
  const [filePath, explicitKey] = process.argv.slice(2);

  if (!filePath) {
    fail('Cách dùng: node scripts/upload-to-r2.js <file> [object-key]');
  }

  const missing = ['R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'].filter(
    (name) => !process.env[name],
  );
  if (missing.length > 0) {
    fail(`Thiếu biến môi trường: ${missing.join(', ')}`);
  }

  let fileBuffer;
  try {
    fileBuffer = await fs.readFile(filePath);
  } catch {
    fail(`Không đọc được file: ${filePath}`);
  }

  // Key ổn định (gọi lại URL cũ được) — mỗi lần chạy ghi đè bản trước:
  //   mobile/app-debug.apk
  const objectKey = explicitKey || `mobile/${path.basename(filePath)}`;

  const client = new S3Client({
    region: 'auto',
    endpoint: resolveEndpoint(),
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: 'application/vnd.android.package-archive',
    }),
  );

  const publicBase = (process.env.R2_PUBLIC_BASE_URL || '').replace(/\/+$/, '');
  console.log(`[upload-to-r2] Đã upload: ${filePath}`);
  console.log(`[upload-to-r2] Object key: ${objectKey}`);
  if (publicBase) {
    console.log(`[upload-to-r2] Public URL: ${publicBase}/${objectKey}`);
  }
}

main().catch((error) => {
  fail(error && error.message ? error.message : String(error));
});
