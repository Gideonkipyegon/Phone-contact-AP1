import sql from 'mssql';
import config from '../db/config.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config()

export const loginRequired  = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized user!'});
    }
};

export const register = async (req, res) => {
    const {FirstName, LastName, Password, MobileNumber, GroupID} = req.body;
    console.log(FirstName, LastName, Password)
    const hashedPassword = bcrypt.hashSync(Password, 10);
    try {
        let pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input('FirstName', sql.VarChar, FirstName)
            .input('LastName', sql.VarChar, LastName)
            .query('SELECT * FROM Contacts WHERE FirstName = @FirstName OR LastName = @LastName');
        const user = result.recordset[0];
        if (user) {
            res.status(409).json({error: 'User already exists'});
        } else {
            await pool.request()
                .input('FirstName', sql.VarChar, FirstName)
                .input('LastName', sql.VarChar, LastName)
                .input('MobileNumber', sql.VarChar, MobileNumber)
                .input('GroupID', sql.VarChar, GroupID)
                .input('hashedpassword', sql.VarChar, hashedPassword)
                .query('INSERT INTO Contacts (FirstName, LastName, MobileNumber, GroupID, Password) VALUES (@Firstname, @LastName, @MobileNumber, @GroupID, @hashedpassword)');
            res.status(200).send({message: 'User created successfully'});
        }
        } catch (error) {
            res.status(500).json(error.message)
    } finally {
        sql.close();
    }
};

export const login = async(req, res) => {
    try {
        const { FirstName , Password} = req.body;
    console.log(FirstName , Password)
    let pool = await sql.connect(config.sql);
    const result = await pool.request()
        .input('FirstName', sql.VarChar, FirstName)
        .query('SELECT * FROM Contacts WHERE FirstName = @FirstName');
    const user = result.recordset[0];
    // console.log(user)
    if (!user) {
        res.status(401).json({ error: 'Invalid FirstName or Password' });
    } else {
        if (!bcrypt.compareSync(Password, user.Password)) {
            res.status(401).json(error.message);
        
        } else {
            const token = `JWT ${jwt.sign({ FirstName: user.FirstName}, process.env.JWT_SECRET)}`;
            res.status(200).json({FirstName: user.FirstName, token: token});
        }
    }
    } catch (error) {
        res.json(error.message)
    }
    
};