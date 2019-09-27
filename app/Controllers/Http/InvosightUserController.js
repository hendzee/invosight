'use strict'

const InvosightUser = use('App/Models/InvosightUser');

class InvosightUserController {
    /** Show all user data */
    async index({ response }){
        const limitNum = 5;
        const offsetBottom = 0;

        const users = await InvosightUser.limit(limitNum).skip(offsetBottom).fetch();

        const pageWillShow = await this.pageCount();

        const data = {users: users, pageWillShow: pageWillShow}

        return response.json(data);
    }

    /** Select user by page selected */
    async pagination({ params, response }) {
        const page = parseInt(params.page);
        const limitNum = 5;
        const dataSize = InvosightUser.count();

        var offsetBottom = ((page-1) * limitNum) + 1;

        if (page === 1){
            offsetBottom = 0;
        }

        const user = await InvosightUser.limit(limitNum).skip(offsetBottom).fetch();

        return response.json(user);
    }

    async pageCount() {
        const limitNum = 5
        const dataSize = await InvosightUser.count();
        
        return (Math.ceil(dataSize / limitNum)) 
    }

    /** Create new data user */
    async store({ request, response }){
        const userInfo = request.only(['first_name', 'last_name', 'address', 'email', 'contact']);

        const user = new InvosightUser();

        user.first_name = userInfo.first_name;
        user.last_name = userInfo.last_name;
        user.address = userInfo.address;
        user.email = userInfo.email;
        user.contact = userInfo.contact;

        await user.save();

        return response.status(201).json(user);
    }

    /** Show specific user by ID */
    async show({ params, response }){
        const user = await InvosightUser.find(params.id);

        return response.json(user);
    }

    /** Update specific user data */
    async update({ params, request, response }){
        const user = await InvosightUser.find(params.id);
        const userInfo = request.only(['first_name', 'last_name', 'address', 'email', 'contact']);

        user.first_name = userInfo.first_name;
        user.last_name = userInfo.last_name;
        user.address = userInfo.address;
        user.email = userInfo.email;
        user.contact = userInfo.contact;

        if(!user){
            return response.status(404).json({data: 'Data not found'})
        }

        await user.save();

        return response.status(201).json(user);
    }

    /** Delete specific user */
    async delete({ params, response }){
        const user = await InvosightUser.find(params.id);

        if(!user){
            return response.status(404).json({ data: 'Data not found' });
        }

        await user.delete();

        return response.status(200).json({ data: 'Data was deleted' });
    }
}

module.exports = InvosightUserController
