## NestJS Task Management System

### Overview

This application is a task management system developed using NestJS. It is designed to handle tasks as specified in the requirements. The `customers` module is integrated with PostgreSQL and utilizes Prisma ORM to perform full CRUD (Create, Read, Update, Delete) operations.

In App and data module are basic tasks from assigment. In customers module are one extra task from assgiment.

### Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **PostgreSQL**: A powerful, open-source relational database system.
- **Prisma ORM**: An advanced ORM for Node.js and TypeScript that simplifies database interactions.

### Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/peterdinis/Nestjs-Customer-Management-System.git
    ```

2. **Install dependencies**:

    Navigate to the project directory and install the required packages:

    ```bash
    cd your-project-directory
    pnpm install
    ```

3. **Configure Environment Variables**:

    Create a `.env` file in the root directory and add your PostgreSQL database connection details:

    ```
    DATABASE_URL=postgresql://user:password@localhost:5432/mydatabase
    PORT=your port number
    ```

4. **Run Database Migrations**:

    Apply Prisma migrations to set up your database schema:

    ```bash
    pnpm prisma migrate dev
    ```

5. **Start the Application**:

    Run the application in development mode:

    ```bash
    pnpm run start:dev
    ```

   Run tests:
    ```bash
    pnpm run test
    ```

    For production, use:

    ```bash
    pnpm run start:prod
    ```
