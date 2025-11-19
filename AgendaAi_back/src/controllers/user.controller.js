import { User } from "../models/User.js"
import createToken from "../utils/createToken.js"
import { hashPass } from "../utils/hashPass.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

export const Register = async (req, res) => {
  const { name, email, password, confirmPass } = req.body
  if (password !== confirmPass) {
    return res.status(400).json({ message: "As senhas estão diferentes" })
  }

  const verifyUser = await User.findOne({
    email: email
  })

  if (verifyUser) {
    return res.status(400).json({ message: "Usuário já existe" })
  }


  const hash = await hashPass(password)

  try {
    const user = await User.create({
      name: name,
      email: email,
      password: hash,
    })
    await user.save()
    return res.status(201).json(user)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Problemas no servidor" })
  }
}

export const Login = async (req, res) => {
  const { email, password } = req.body
  console.log('LOGIN REQ BODY', req.body)
  if (!email || !password) throw new Error("Email e senha são obrigatórios")
  try {
    const verifyUser = await User.findOne({
      email: email
    })

    const verifyPass = await bcrypt.compare(password, verifyUser.password)
    console.log('VERIFICANDO SENHA:', verifyPass)
    if(!verifyPass){
      return  res.status(400).json({ message: "Usuário ou senha inválidos" })
    }

    if (verifyUser) {
      try {
        const token = createToken({ name: verifyUser.name, id: verifyUser._id }, '3d')
        res.status(200).json({
          user: verifyUser,
          token: token
        })
        console.log('USUÁRIO LOGADO:', verifyUser)
      } catch (error) {
        console.error(error)
      }
    } else {
      res.status(400).json({ message: "Usuário ou senha inválidos" })
    }
  } catch (error) {
    console.error(error)
  }
}

export const GetUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await User.findById(id)
    console.log(user)
    if (!user) {
      return res.status(400).json({ message: "Usuário não existe" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.log(error)
  }
}

// 1 - PEDIR RESET DE SENHA
export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  console.log(email)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "Email não cadastrado" });
    }

    const secret = process.env.SECRET_KEY + user.password;
    const token = jwt.sign(
      { id: user._id, email: user.email },
      secret,
      { expiresIn: "15m" }
    );

    const resetURL = `http://localhost:4200/new-password/${user._id}/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: 'brunocapita.dev@gmail.com',
        pass: 'rphp tdwn ynhw wphp',
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: "brunocapita.dev@gmail.com",
      subject: "Redefinição de senha",
      html: `
        <p>Você solicitou a redefinição da senha.</p>
        <p>Clique no link abaixo:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>Link expira em 15 minutos.</p>
      `
    });

    res.json({ message: "Email enviado com sucesso!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
};


// 2 - RESETAR SENHA
export const resetPassword = async (req, res) => {
  const id = req.query.id;
  const token = req.query.token;
  const { password } = req.body;
  console.log(token)
  try {
    const oldUser = await User.findById(id);

    if (!oldUser) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const secret = process.env.SECRET_KEY + oldUser.password;

    try {
      const verified = jwt.verify(token, secret);
      const hashed = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate(id, { password: hashed });
      console.log('SENHA REDEFINIDA PARA USUÁRIO:', id);
      res.json({ message: "Senha redefinida com sucesso!" });

    } catch (err) {
      return res.status(400).json({ error: "Token inválido ou expirado" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno" });
  }
};

export const GetAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const ToggleStatusUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "usuario não encontrado" });
    }

    res.status(200).json({
      message: `Usuario ${isActive ? "ativado" : "inativado"} com sucesso!`,
      user,
    });
  } catch (error) {
    console.error("Erro ao alterar status:", error);
    res.status(500).json({ message: "Erro ao alterar status do usuario." });
  }
};
