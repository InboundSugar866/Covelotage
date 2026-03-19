/**
 * @fileOverview Administrative endpoints to manage users and routes.
 */

import UserModel from '../model/User.model.js';
import RouteModel from '../model/Route.model.js';

/**
 * List all users (without passwords)
 */
export async function listUsers(req, res) {
    try {
        const users = await UserModel.find({}, { password: 0 });
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Get a single user by id (without password)
 */
export async function getUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id, { password: 0 });
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json(user);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * Delete a user by id
 */
export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const result = await UserModel.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ error: 'User not found' });
        return res.status(200).json({ msg: 'User deleted' });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

/**
 * List all routes
 */
export async function listRoutes(req, res) {
    try {
        const routes = await RouteModel.find({});
        return res.status(200).json(routes);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export default { listUsers, getUserById, deleteUser, listRoutes };
