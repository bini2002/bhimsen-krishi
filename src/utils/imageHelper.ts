import axios from "axios";

export const imageHelper = async (
  id: number | string | null
): Promise<string | null> => {
  if (!id) {
    console.error("Invalid image ID provided.");
    return null; // Fallback if no ID is provided
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/imageupload/${id}`
    );

    // Assuming the API response has a structure like { data: { image: "/path/to/image" } }
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/${response.data?.data?.image}`;
    return imageUrl;
  } catch (error) {
    console.error("Error fetching the image:", error);
    return null;
  }
};
