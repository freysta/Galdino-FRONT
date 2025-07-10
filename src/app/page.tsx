"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Text, Box } from "@mantine/core";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dotBounce {
          0%,
          20% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        .pulse-bg-1 {
          animation: pulse 3s ease-in-out infinite;
        }

        .pulse-bg-2 {
          animation: pulse 2s ease-in-out infinite 0.5s;
        }

        .pulse-bg-3 {
          animation: pulse 4s ease-in-out infinite 1s;
        }

        .fade-in {
          animation: fadeIn 1s ease-out;
        }

        .dot-1 {
          animation: dotBounce 1.5s ease-in-out infinite;
        }

        .dot-2 {
          animation: dotBounce 1.5s ease-in-out infinite 0.2s;
        }

        .dot-3 {
          animation: dotBounce 1.5s ease-in-out infinite 0.4s;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1f2937 0%, #16a34a 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>

      <div
        style={{
          height: "100vh",
          background:
            "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <Box
          className="pulse-bg-1"
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.1)",
          }}
        />
        <Box
          className="pulse-bg-2"
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "rgba(22, 163, 74, 0.15)",
          }}
        />
        <Box
          className="pulse-bg-3"
          style={{
            position: "absolute",
            top: "30%",
            right: "20%",
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "rgba(34, 197, 94, 0.08)",
          }}
        />

        <Container size="sm" style={{ textAlign: "center", zIndex: 1 }}>
          <Box className="fade-in">
            {/* Logo */}
            <Box
              className="pulse-animation"
              style={{
                width: 120,
                height: 120,
                borderRadius: 30,
                background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 32px",
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.3)",
              }}
            >
              <Text size="3rem" fw={700} c="white">
                G
              </Text>
            </Box>

            {/* Title */}
            <Text size="2.5rem" fw={700} mb="xs" className="gradient-text">
              Galdino
            </Text>

            {/* Subtitle */}
            <Text size="lg" c="#6b7280" mb={48} fw={500}>
              Sistema de Transporte Universitário
            </Text>

            {/* Loading animation */}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Text size="md" c="#9ca3af" fw={500}>
                Carregando sistema
              </Text>
              <Box style={{ display: "flex", gap: 4 }}>
                <Box
                  className="dot-1"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                  }}
                />
                <Box
                  className="dot-2"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                  }}
                />
                <Box
                  className="dot-3"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
}
