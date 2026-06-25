import crypto from "crypto";
import { HashService } from "../../domain/services/HashService";

export class PBKDF2HashService implements HashService {

    async hash(text: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const salt = crypto.randomBytes(16).toString("hex");

            crypto.pbkdf2(text, salt, 100000, 64, "sha512", (err, derivedKey) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(`${salt}:${derivedKey.toString("hex")}`);
            });
        });
    }

    async compare(text: string, hash: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const [salt, key] = hash.split(":");

            crypto.pbkdf2(text, salt, 100000, 64, "sha512", (err, derivedKey) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(key === derivedKey.toString("hex"));
            });
        });
    }
}