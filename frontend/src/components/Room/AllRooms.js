import React, { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Text,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import axios from "axios";
import { MdCheckCircle } from "react-icons/md";

const AllRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get("/api/user/getUser");
        setCurrentUser(data.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/room");
        setRooms(data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
  };

  const handleHeaderClick = () => {
    if (!selectedRoom?.participants.some((p) => p._id === currentUser?._id)) {
      onOpen();
    }
  };

  const handleJoinRoom = async () => {
    try {
      await axios.post("/api/room/join", { roomId: selectedRoom._id });
      toast({
        title: "You Joined The Room",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error while joining the room",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await axios.delete("/api/room", { data: { roomId: selectedRoom._id } });
      toast({
        title: "Room Deleted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "You Are Not The Owner",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex height="100vh">
      {/* Left Side (Room List) */}
      <Box width="30%" bg="gray.100" p={4} overflowY="auto">
        <Heading size="md">Rooms</Heading>
        {rooms.map((room) => (
          <Box
            key={room.id}
            p={3}
            my={2}
            bg="white"
            borderRadius="md"
            cursor="pointer"
            _hover={{ bg: "gray.200" }}
            onClick={() => handleRoomClick(room)}
          >
            <Text fontWeight="bold">{room.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {room.creatorId.username}
            </Text>
          </Box>
        ))}
      </Box>

      {/* Right Side (Selected Room Details) */}
      <Box flex="1" bg="white" p={4} display="flex" flexDirection="column">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <Box
              p={4}
              bg="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom="1px solid gray"
              cursor="pointer"
              onClick={handleHeaderClick}
            >
              <Box>
                <Heading size="md">{selectedRoom.name}</Heading>
                <Text fontSize="sm" color="gray.600">
                  {selectedRoom.creatorId.username}
                </Text>
              </Box>
              <Box>
                <Text fontSize="sm" color="gray.600">
                  Participants:{" "}
                  {selectedRoom.participants.map((p) => p.username).join(", ")}
                </Text>
              </Box>
            </Box>

            {/* Chat Content */}
            <Box flex="1" p={4} overflowY="auto">
              {/* Display chat messages or room content here */}
              <Text>Chatroom messages will be displayed here...</Text>
            </Box>
          </>
        ) : (
          <Text>Select a room to view details</Text>
        )}
      </Box>

      {/* Join/Delete Room Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedRoom?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Do you want to join or delete this room?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={handleJoinRoom} mr={3}>
              Join Room
            </Button>
            <Button colorScheme="red" onClick={handleDeleteRoom}>
              Delete Room
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default AllRooms;

