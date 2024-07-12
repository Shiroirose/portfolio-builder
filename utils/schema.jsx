// import { boolean, integer } from "drizzle-orm/pg-core";

const { boolean, integer, pgTable, serial, varchar, text } = require("drizzle-orm/pg-core");

export const userInfo=pgTable('userInfo',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    username:varchar('username'),
    bio:text('bio'),
    location:varchar('location'),
    link:varchar('link'),
    profileImage:varchar('profileImage')

})

export const project=pgTable('project',{
    id:serial('id').primaryKey(),
    name:varchar('name'),
    desc:text('desc'),
    url:varchar('url'),
    logo:varchar('logo'),
    banner:varchar('banner'),
    category:varchar('category'),
    active:boolean('active').default(true),
    emailRef:varchar('emailRef'),
    userRef:integer('userRef').references(()=>userInfo.id), //connects the user though id from this table to the userinfo table
    showGraph:boolean('showGraph').default(true),
    order:integer('order').default(0)

})

