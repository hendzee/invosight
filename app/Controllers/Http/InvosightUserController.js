'use strict'

const InvosightUser = use('App/Models/InvosightUser');

class InvosightUserController {
    /** Show all user data */
    async index({ response }){
        let user = await InvosightUser.all();

        return response.json(user);
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
