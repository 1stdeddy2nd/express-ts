import moment from "moment-timezone";
import axios from "axios";
import { prisma } from "../prisma/client";
import schedule from "node-schedule";
import app from "./app";

const port = process.env.PORT || 3000;

// send birthday message
const handlSendMsg = (fullName: string, email: string) => {
  return axios.post("https://email-service.digitalenvision.com.au/send-email", {
    email,
    message: `Hey, ${fullName} it's your birthday`,
  });
};

// CRON JOB
const handleCronSendyMsg = async () => {
  // count success send message
  let countSuccess = 0;

  // get all user
  const users = await prisma.user.findMany({
    include: { location: { select: { timezone: true } } },
  });
  users.forEach((user) => {
    const userBirthDate = moment(user.birth_date)
      .set("year", new Date().getFullYear())
      .tz(user.location.timezone);
    const tempUserBirthDate = userBirthDate.clone();
    const userFullName = user.first_name + " " + user.last_name;

    // make it 9am
    userBirthDate.set("hour", 9);

    const job = schedule.scheduleJob(userBirthDate.format(), function () {
      handlSendMsg(userFullName, user.email)
        .then((res) => {
          // lets make it happen again next year in 9am
          userBirthDate.add(1, "year");
          userBirthDate.set("month", tempUserBirthDate.get("month"));
          userBirthDate.set("date", tempUserBirthDate.get("date"));
          userBirthDate.set("hour", 9);
          userBirthDate.set("minute", 0);

          console.log(
            `send email to ${userFullName} success! will send again in ${userBirthDate}`
          );
          countSuccess += 1;
          job.reschedule(userBirthDate.format());
        })
        .catch(() => {
          // try to resend it after 1 minute
          userBirthDate.add(1, "minute");
          console.log(
            `send email to ${userFullName} failed! will send again in ${userBirthDate}`
          );
          job.reschedule(userBirthDate.format());
        })
        .finally(() => {
          console.log(`Success send ${countSuccess}/${users.length} message!`);
        });
    });
  });
};

// comment or uncomment to handle scheduler
// handleCronSendyMsg();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
