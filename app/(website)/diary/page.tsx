"use client";
import { VscDiffAdded } from "react-icons/vsc";
import { PiCaretLeft, PiCaretRight,PiCaretDownBold } from "react-icons/pi";
import React, { useState, useMemo } from 'react';
//import DoughnutChart from "../components/DoughnutChart";
import AddFoodtoDiary from "../components/AddFoodtoDiary";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import EnergySummary from "../components/EnergySummary";

export default function Diary() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = (direction: "prev" | "next") => {
    setSelectedDate((prevDate) => {
        const newDate = new Date(prevDate);
        newDate.setDate(direction === "prev" ? prevDate.getDate() - 1 : prevDate.getDate() + 1);
        return newDate;
    });
    };
    

    
    const [itemToDelete, setItemToDelete] = useState<{
        group: string;
        index: number;
        name: string;
      } | null>(null);

      const [diaryEntries, setDiaryEntries] = useState<{
        [key: string]: { name: string; servingSize: number; calories: number; protein: number; carbs: number; fat: number }[];
      }>({
        Uncategorized: [],
        Breakfast: [],
        Dinner: [],
        Snacks: [],
      });
    
      const totals = useMemo(() => {
        const totalValues = {
          calories: 0,
          protein: 0,
          carbs: 0,
          fat: 0,
        };
      
        Object.values(diaryEntries).forEach((group) => {
          group.forEach((entry) => {
            totalValues.calories += Number(entry.calories) || 0;
            totalValues.protein += Number(entry.protein) || 0;
            totalValues.carbs += Number(entry.carbs) || 0;
            totalValues.fat += Number(entry.fat) || 0;
          });
        });
      
        return totalValues;
      }, [diaryEntries]);
      
      // การแสดงผล
      <div className="mt-6">
        <EnergySummary totals={totals} />
        <div className="mt-4 font-semibold">
          <p>Total Calories: {totals.calories.toFixed(1)} kcal</p>
          <p>Protein: {totals.protein.toFixed(1)} g</p>
          <p>Carbs: {totals.carbs.toFixed(1)} g</p>
          <p>Fat: {totals.fat.toFixed(1)} g</p>
        </div>
      </div>
      
      
  
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
  
    const handleAddToDiary = (
        group: string,
        food: { 
          name: string; 
          servingSize: number; 
          calories: number; 
          protein: number; 
          carbs: number; 
          fat: number; 
        }
      ) => {
        setDiaryEntries((prevEntries) => ({
          ...prevEntries,
          [group]: [
            ...prevEntries[group], 
            {
              ...food,
              calories: food.calories || 0,
              protein: food.protein || 0,
              carbs: food.carbs || 0,
              fat: food.fat || 0,
            }
          ],
        }));
      };
      
  
    const handleRemoveItem = () => {
        if (itemToDelete) {
          const { group, index } = itemToDelete;
          setDiaryEntries((prevEntries) => ({
            ...prevEntries,
            [group]: prevEntries[group].filter((_, i) => i !== index),
          }));
          setIsDeleteModalOpen(false);
        }
      };

    return (
      <>
      <AddFoodtoDiary
        isOpen={isModalOpen}
        closeModal={closeModal}
        onAdd={handleAddToDiary}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen && !!itemToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleRemoveItem}
        itemName={itemToDelete?.name || "this item"}
      />
      <div className="">
      <div className= "text-black font-mono flex justify-between mx-[200px]">
        <div className="flex w-[75%] flex-col">
        
        <div className="bg-white flex pl-[20] mb-[7]">
            <div className="flex items-center justify-between h-[50] flex-wrap ">
                <button onClick={openModal} className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>FOOD</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>EXERCISE</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>BIOMETRIC</button>
                <button className="flex items-center justify-center hover:border-b-4 hover:border-black border-b-4 border-transparent pb-[9] pt-[13] mr-[30]"><div className="mr-[6]"><VscDiffAdded /></div>NOTE</button>
            </div>
        </div>
            {/* แสดงรายการอาหาร */}
          {Object.keys(diaryEntries).map((group) => (
            <div key={group} className="bg-white flex flex-col mb-[7]">
              <div className="flex justify-between px-[10] py-[5] border-b">
                <span className="font-semibold">{group}</span>
                <button className="mr-[20]">
                  <PiCaretDownBold />
                </button>
              </div>
              {diaryEntries[group].map((entry, index) => (
                <div
                  key={index}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setItemToDelete({ group, index, name: entry.name });
                    setIsDeleteModalOpen(true);
                  }}
                  className="flex justify-between px-[10] py-[2] text-sm border-b cursor-pointer hover:bg-gray-100"
                >
                  <span>{entry.name}</span>
                  <span>{entry.servingSize} g</span>
                </div>
              ))}
            </div>
          ))}
        <div>
        <div className="mt-6">
          <EnergySummary totals={totals} />
        </div>
        </div>
        </div>
        <div className="bg-white flex items-center w-[20%] px-[20] justify-between h-[50]">
            <button onClick={() => handleDateChange("prev")} className="text-[20px]">
                <PiCaretLeft />
            </button>
            <span>{selectedDate.toDateString()}</span>
            <button onClick={() => handleDateChange("next")} className="text-[20px]">
                <PiCaretRight />
            </button>
        </div>
        </div> 
        </div>  
      </>
    );
  }
  