// Form.js
import React, { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FormContainer,
  InputArea,
  Input,
  Label,
  Button
} from "./FormStyles";

const Form = ({ getUsers, onEdit, setOnEdit }) => {
  const ref = useRef();

  useEffect(() => {
    if (onEdit) {
      const user = ref.current;

      user.nome.value = onEdit.nome;
      user.email.value = onEdit.email;
      user.senha.value = onEdit.senha;
      user.nome_usuario.value = onEdit.nome_usuario;
    }
  }, [onEdit]);

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    const user = ref.current;

    if (
      !user.nome.value ||
      !user.email.value ||
      !user.senha.value ||
      !user.nome_usuario.value
    ) {
      return toast.warn("Preencha todos os campos!");
    }

    // Validação da senha
    const senha = user.senha.value;
    const senhaRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
    if (!senhaRegex.test(senha)) {
      return toast.error(
        "A senha deve ter no mínimo 6 caracteres, incluindo um número, uma letra e um caractere especial!"
      );
    }

    const nome = user.nome.value;
    const email = user.email.value;

    try {
      // Verifica se o usuário já está cadastrado pelo campo de nome ou e-mail
      const response = await axios.get(
        `http://localhost:8800?nome=${encodeURIComponent(
          nome
        )}&email=${encodeURIComponent(email)}`
      );
      const usuariosCadastrados = response.data;

      const usuarioExistente = usuariosCadastrados.find(
        (usuario) => usuario.nome === nome || usuario.email === email
      );

      if (usuarioExistente && usuarioExistente.id !== id) {
        return toast.error("Usuário já cadastrado.");
      }

      if (onEdit) {
        await axios
          .put(`http://localhost:8800/${onEdit.id}`, {
            nome: user.nome.value,
            email: user.email.value,
            senha: user.senha.value,
            nome_usuario: user.nome_usuario.value,
          })
          .then(({ data }) => toast.success(data))
          .catch(({ data }) => toast.error(data));
      } else {
        await axios
          .post("http://localhost:8800", {
            nome: user.nome.value,
            email: user.email.value,
            senha: user.senha.value,
            nome_usuario: user.nome_usuario.value,
          })
          .then(({ data }) => toast.success(data))
          .catch(({ data }) => toast.error(data));
      }

      user.nome.value = "";
      user.email.value = "";
      user.senha.value = "";
      user.nome_usuario.value = "";

      setOnEdit(null);
      getUsers();
    } catch (error) {
      toast.error("Ocorreu um erro ao verificar o usuário cadastrado.");
      console.error(error);
    }
  };

  return (
    <FormContainer ref={ref} onSubmit={handleSubmit}>
      <InputArea>
        <Label>Nome</Label>
        <Input name="nome" />
      </InputArea>
      <InputArea>
        <Label>E-mail</Label>
        <Input name="email" type="email" />
      </InputArea>
      <InputArea>
        <Label>Senha</Label>
        <Input name="senha" type="password" />
      </InputArea>
      <InputArea>
        <Label>Nome do Usuário</Label>
        <Input name="nome_usuario" />
      </InputArea>

      <Button type="submit">SALVAR</Button>
    </FormContainer>
  );
};

export default Form;
