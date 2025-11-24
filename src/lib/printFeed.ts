import { Feed } from "./db/schema";
import { User } from "./db/users";

export function printFeed(feed: Feed, user: User) {
    console.log(`Название канала: ${feed.name}`);
    console.log(`URL канала: ${feed.url}`);
    console.log(`Пользователь: ${user.name}`);
    console.log("---");
}
