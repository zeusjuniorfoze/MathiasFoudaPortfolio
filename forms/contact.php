<?php

require '../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$receiving_email_address = 'foudamathias20@gmail.com';

if (isset($_POST['name']) && isset($_POST['email']) && isset($_POST['subject']) && isset($_POST['message'])) {
    $from_name = htmlspecialchars($_POST['name']);
    $from_email = htmlspecialchars($_POST['email']);
    $subject = htmlspecialchars($_POST['subject']);
    $message = htmlspecialchars($_POST['message']);

    $smtp_host = 'smtp.mail.me.com';
    $smtp_username = 'foudamathias20@gmail.com';
    $smtp_password = 'kkpr-yhkd-oxrj-qjqc';
    $smtp_port = 587;

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = $smtp_host;
        $mail->SMTPAuth = true;
        $mail->Username = $smtp_username;
        $mail->Password = $smtp_password;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $smtp_port;

        $mail->setFrom($smtp_username, 'Contact Form');
        $mail->addAddress($receiving_email_address);

        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Submission: ' . $subject;

        $mail->Body = '
            <html>
            <head><style>/* styles ici */</style></head>
            <body>
                <div><strong>Name:</strong> ' . $from_name . '</div>
                <div><strong>Email:</strong> ' . $from_email . '</div>
                <div><strong>Subject:</strong> ' . $subject . '</div>
                <div><strong>Message:</strong><br>' . nl2br($message) . '</div>
            </body>
            </html>';

        if ($mail->send()) {
            echo 'OK';
        } else {
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        }
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
} else {
    echo 'Form submission failed. Missing required fields.';
}
?>
