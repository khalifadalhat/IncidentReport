const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Support Platform API",
      version: "1.0.0",
      description:
        "Real-time customer support API with unified User model (Customer/Agent/Admin).",
      contact: {
        name: "API Support",
        email: "support@yourapp.com",
      },
    },

    servers: [
      {
        url:
          process.env.NODE_ENV === "production"
            ? "https://bizapp-tllq.onrender.com"
            : "http://localhost:5000",
        description: "API Server",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "JWT token from /api/auth/login. Add to header: Authorization: Bearer {token}",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            fullname: { type: "string" },
            email: { type: "string" },
            role: {
              type: "string",
              enum: ["customer", "agent", "admin", "supervisor"],
            },
            department: { type: "string" },
            phone: { type: "string" },
          },
        },
        Case: {
          type: "object",
          properties: {
            id: { type: "string" },
            customerName: { type: "string" },
            issue: { type: "string" },
            department: {
              type: "string",
              enum: [
                "Funding Wallet",
                "Buying Airtime",
                "Buying Internet Data",
                "E-commerce Section",
                "Fraud Related Problems",
                "General Services",
              ],
            },
            status: {
              type: "string",
              enum: ["pending", "active", "resolved", "rejected"],
            },
            assignedAgent: { $ref: "#/components/schemas/User" },
          },
        },
        Message: {
          type: "object",
          properties: {
            id: { type: "string" },
            text: { type: "string" },
            senderRole: { type: "string", enum: ["customer", "agent"] },
            timestamp: { type: "string", format: "date-time" },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
module.exports = specs;
