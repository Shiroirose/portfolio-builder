// import { boolean, integer } from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";
const { boolean, integer, pgTable, serial, varchar, text } = require("drizzle-orm/pg-core");

export const userInfo=pgTable('userInfo',{
    id:serial('id').primaryKey(),
    name:varchar('name').notNull(),
    email:varchar('email').notNull(),
    username:varchar('username'),
    bio:text('bio'),
    location:varchar('location'),
    link:varchar('link'),
    profileImage:varchar('profileImage'),
    theme:varchar('theme').default('dark'),
    admintheme:varchar('admintheme').default('dark'),
    linkedin:varchar('linkedin'),
    github:varchar('github'),
    showcontri:boolean('showcontri').default(true),
    showtour:boolean("showtour").default(false)

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

export const ProjectClicks=pgTable('projectClicks',{
    id:serial('id').primaryKey(),
    projectRef:integer('projectRef').references(()=>project.id),
    month:varchar('month')
})

export const userProjectRelation=relations(userInfo,({many})=>(
    {
        project:many(project)
    }
))

export const postRelation=relations(project,({one})=>(
    {
        user:one(userInfo,{fields:[project.userRef],references:[userInfo.id]})
    }
))


