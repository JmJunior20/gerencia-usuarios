import axios from "axios";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";

const FormContainer = styled.form`
    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
      width: 80%;
  }
`;

const InputArea = styled.div`
    display: flex;
    flex-direction: column;
`;

const Input = styled.input`
    with: 120px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;

    @media (max-width: 768px) {
      width: 90%;
    }
`;

const Label = styled.label``;

const Button = styled.button`
    padding: 10px;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    background-color: #2c73d2;
    color: white;
    height: 42px;

    @media (max-width: 768px) {
      width: 65%;
    }
`;

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

    const handleSubmit = async (e) => {
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
            return toast.error("A senha deve ter no mímino 6 caracteres, incluindo um número, uma letra e um caractere especial!");
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
      
          if (usuarioExistente) {
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