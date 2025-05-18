import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from "./auth.types";
import { AuthStrategyNames } from "./auth.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategyNames.JWT) {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get<string>('JWT_SECRET'),
        })
    }

    async validate(payload: JwtPayload): Promise<JwtPayload> {
        // TODO: validation logic here
        
        // For simplicity we return the payload, but you can map this to an arbitrary object as per your needs
        return payload 
    }
}