export const mailValues = {
  confirmation(mailConfirmationId: string, email: string) {
    return {
      from: `Mail confirmation at Book API <${process.env.EMAIL_URL}>`,
      subject: "Confirm Your Email Address",
      text: `${process.env.MAIN_URL}/confirm-email/${mailConfirmationId}`,
      html: `<a
            href="${process.env.MAIN_URL}/confirm-email/${mailConfirmationId}"
            style="
              background-color: #4672e7;
              padding: 8px 16px;
              border-radius: 8px;
              text-decoration: none;
              color: #ffffff;
            "
            >Confirm email</a
          >`,

      to: email,
    };
  },
};
