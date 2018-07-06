import { Profile } from "./profile.model"

export interface User {
    token: string;
    profile: Profile;
}