import { Controller, Get, UseGuards } from "@nestjs/common";
import { RolesGuard } from "./roles.guard";
import { Roles } from "./roles.decorator";

@Controller('role-testing')
@UseGuards(RolesGuard)
export class RoleTestingController {
    constructor() {}

    @Get('adminRoleCheck')
    @Roles('admin')
    async adminRoleCheck() {
        return { message: "Success! You have the admin role!" };
    }

    @Get('userRoleCheck')
    @Roles('user')
    async userRoleCheck() {
        return { message: "Success! You have the user role!" };
    }

    @Get('userAndAdminRoleCheck')
    @Roles('user', 'admin')
    async userAndAdminRoleCheck() {
        return { message: "Success! You have the user and admin role!" };
    }
}