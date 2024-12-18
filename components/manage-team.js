import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ManageTeam({ closeModal, selectedTeam }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [teamPlayers, setTeamPlayers] = useState([]);

  useEffect(() => {
    if (selectedTeam) {
      setTeamPlayers(selectedTeam.teamPlayers || []);
    }
  }, [selectedTeam]);

  async function handleAddPlayer() {
    if (phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    const response = await axios.post(`/user/event/team`, {
      teamId: selectedTeam.id,
      phone: phoneNumber,
    });
    if (response.data.success) {
      toast.success("Player added successfully");
      setPhoneNumber("");
      fetchTeamPlayers();
    } else {
      toast.error(response.data.message || "Something went wrong");
    }
  }

  async function handleDeletePlayer(playerId) {
    const response = await axios.delete(`/user/event/team`, {
      data: {
        teamId: selectedTeam.id,
        userId: playerId,
      },
    });
    if (response.data.success) {
      toast.success("Player deleted successfully");
      fetchTeamPlayers();
    } else {
      toast.error(response.data.message || "Something went wrong");
    }
  }

  async function fetchTeamPlayers() {
    try {
      const response = await axios.get(`/user/event/team/${selectedTeam.id}`);
      if (response.data.success) {
        setTeamPlayers(response.data.data.teamPlayers || []);
      } else {
        toast.error(response.data.message || "Failed to fetch team players.");
      }
    } catch (error) {
      console.error("Error fetching team players:", error);
      toast.error("Error fetching team players.");
    }
  }

  return (
    <div className="sm:mb-0 mb-52">
      <div className="flex sm:items-start flex-col items-center justify-center">
        <div className="bg-white p-5 md:p-8 shadow-2xl rounded-lg w-full max-w-lg relative ">
          <XMarkIcon
            onClick={closeModal}
            className="h-6 w-6 absolute top-4 right-4 cursor-pointer"
            aria-hidden="true"
          />
          <h2 className="mt-2 text-center text-xl md:text-2xl font-bold leading-6 tracking-tight text-gray-900">
            Manage Players
          </h2>
          <label className="block mt-2 text-center">
            Team #{selectedTeam.id}
          </label>
          <label className="block mt-2 text-center">
            <span className="font-bold">
              {selectedTeam.isChallengeEvent 
                ? "Challenge Event" 
                : selectedTeam.eventSportCategory?.sport?.name || "N/A"}
            </span>
            <span className="text-gray-500">
              {!selectedTeam.isChallengeEvent && 
                ` - ${selectedTeam.eventSportCategory?.sportCategory?.name || "N/A"}`}
            </span>
          </label>
          <label
            htmlFor="phone"
            className="block mt-4 text-sm font-medium leading-6 text-gray-900 max-w-full"
          >
            Enter Player&#39;s Phone Number
          </label>
          <div className="flex flex-col">
            <div className="flex space-x-2 mt-2">
              <div className="flex flex-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">
                  +91
                </span>
                <input
                  type="text"
                  id="mobile"
                  className="block w-full focus:outline-none flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                onClick={handleAddPlayer}
              >
                Add Player
              </button>
            </div>
            {teamPlayers.length > 0 ? (
              <>
                <label className="mt-6 text-center text-base md:text-lg font-bold leading-6 tracking-tight text-gray-900">
                  Team Players
                </label>
                <div className="overflow-y-auto">
                  <table className="mt-2 w-full text-gray-500">
                    <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                      <tr>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:table-cell"
                        >
                          S.No
                        </th>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:table-cell"
                        >
                          Phone
                        </th>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:table-cell"
                        >
                          Sign Up Status
                        </th>
                        <th
                          scope="col"
                          className="py-3 pr-8 font-normal sm:table-cell"
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                      {teamPlayers.map((player, index) => (
                        <tr key={player.id}>
                          <td className="py-6 pr-8">
                            <div className="font-medium text-gray-900">
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-6 pr-8">
                            <div className="font-medium text-gray-900">
                              {player.user.name || player.user.phone}
                            </div>
                          </td>
                          <td className="py-6 pr-8">
                            {player.user.isPhoneVerified ? "✅" : "⏳"}
                          </td>
                          <td className="py-6 pr-8">
                            <TrashIcon
                              className="text-red-500 h-6 w-6 cursor-pointer"
                              onClick={() => handleDeletePlayer(player.user.id)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex justify-center mt-6">
                <label className="text-base md:text-lg font-bold leading-6 tracking-tight text-gray-900">
                  No players added yet
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
