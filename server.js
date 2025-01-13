socket.on("update-location-captain", async ({ userId, location }) => {
  try {
    await CaptainModel.findByIdAndUpdate(userId, { location });
    console.log("Location updated successfully:", location);
  } catch (error) {
    console.error("Error updating location:", error);
  }
});
