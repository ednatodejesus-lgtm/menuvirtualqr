export default function LoadingScreen({
  message = "A preparar o menu...",
}) {
  return (
    <div className="mvqr-loading">

      <div className="mvqr-loading__animation">
        🍽️
      </div>

      <p>
        {message}
      </p>

    </div>
  );
}